import os
import time
from dotenv import load_dotenv
import google.generativeai as genai
import pathlib
import json
from fastapi import FastAPI, UploadFile, File, Form
import shutil
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup
from typing import Optional

# Yerel geliştirme için .env dosyasındaki değişkenleri yükle
load_dotenv()

# Gemini API anahtarını ortam değişkeninden (Environment Variable) alıyoruz.
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY ortam değişkeni bulunamadı! Lütfen bir .env dosyası oluşturun veya ortam değişkenini ayarlayın.")

genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-2.5-flash")

MAX_RETRIES = 3
RETRY_DELAY = 60  # saniye


def gemini_iste(icerik: list) -> str:
    """Gemini API'ye istek atar; 429 hatalarında retry uygular."""
    for deneme in range(MAX_RETRIES):
        try:
            response = model.generate_content(icerik)
            return response.text
        except Exception as e:
            hata_str = str(e)
            # 429 / quota hatası mı?
            if "429" in hata_str or "quota" in hata_str.lower() or "RESOURCE_EXHAUSTED" in hata_str:
                # retry_delay saniyesini hatadan okumaya çalış
                import re
                eslesen = re.search(r'retry_delay.*?seconds.*?(\d+)', hata_str, re.DOTALL)
                bekleme = int(eslesen.group(1)) if eslesen else RETRY_DELAY
                if deneme < MAX_RETRIES - 1:
                    time.sleep(bekleme + 2)  # +2 güvenlik payı
                    continue
                else:
                    raise Exception(
                        f"QUOTA_EXCEEDED: Gemini API ücretsiz kullanım limitiniz doldu. "
                        f"Lütfen {bekleme} saniye bekleyip tekrar deneyin veya "
                        f"ücretli plana geçmek için https://ai.dev/rate-limit adresini ziyaret edin."
                    )
            raise  # Başka hata ise direkt fırlat

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ——— URL'den iş ilanı çekme ———
def ilan_cek(url: str) -> dict:
    """Verilen URL'den iş ilanı metnini scrape eder."""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        yanit = requests.get(url, headers=headers, timeout=15)
        yanit.raise_for_status()

        soup = BeautifulSoup(yanit.text, "html.parser")

        # Gereksiz elementleri kaldır
        for eleman in soup(["script", "style", "nav", "footer", "header", "iframe", "noscript"]):
            eleman.decompose()

        metin = soup.get_text(separator="\n", strip=True)

        # Çok uzun metinleri kırp (Gemini token limiti için)
        if len(metin) > 10000:
            metin = metin[:10000]

        if len(metin.strip()) < 50:
            return {"hata": "Bu URL'den yeterli metin çıkarılamadı. Lütfen ilan metnini manuel olarak yapıştırın."}

        return {"metin": metin}

    except requests.exceptions.Timeout:
        return {"hata": "Sayfa yanıt vermedi (zaman aşımı). Lütfen ilan metnini manuel olarak yapıştırın."}
    except requests.exceptions.ConnectionError:
        return {"hata": "Siteye bağlanılamadı. URL'yi kontrol edin veya ilan metnini manuel olarak yapıştırın."}
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 403:
            return {"hata": "Bu site otomatik erişime izin vermiyor. Lütfen ilan metnini manuel olarak yapıştırın."}
        return {"hata": f"Sayfa hata verdi (HTTP {e.response.status_code}). Lütfen ilan metnini manuel olarak yapıştırın."}
    except Exception as e:
        return {"hata": f"İlan çekilirken hata oluştu: {str(e)}"}


# ——— CV Analiz (mevcut) ———
def cv_analiz_et(pdf_yolu:str)-> dict: #pdf yolunun tipi string ve döndüreceği de sözlüktür anlamında 
    
    try:
        pdf_dosya = pathlib.Path(pdf_yolu)

        if not pdf_dosya.exists(): 
            return {"hata": "PDF dosyası bulunamadı."}
        

        prompt = """
        Sana bir PDF dosyası gönderiyorum.

        Önce dosyanın CV olup olmadığını kontrol et.
        Eğer CV değilse sadece şunu yaz: {"hata": "Bu bir CV değil. Ben sadece CV analizi yapabilirim."}
        Eğer CV ise aşağıdaki JSON formatında döndür:

        {
            "puan": <0-100 arası sayı>,
            "guclu_yonler": ["madde1", "madde2", "madde3",...],
            "zayif_yonler": ["madde1", "madde2", "madde3",...],
            "oneriler": ["madde1", "madde2", "madde3",...],
            "ik_yorumlari": {
                "genel_degerlendirme": "Bu adayın genel profili hakkında 2-3 cümlelik İK uzmanı değerlendirmesi",
                "mulakat_tavsiyesi": "Bu adayla mülakatta nelere odaklanılmalı, hangi sorular sorulmalı",
                "kariyer_potansiyeli": "Adayın kariyer gelişim potansiyeli ve hangi alanlarda ilerleyebileceği",
                "dikkat_edilmesi_gerekenler": "İşe alım sürecinde dikkat edilmesi gereken noktalar veya kırmızı bayraklar"
            }
        }

        ik_yorumlari bölümünde deneyimli bir İK uzmanı gibi davran. Profesyonel, yapıcı ve detaylı yorumlar yaz.
        Her bir yorum 2-3 cümle olsun.

        SADECE JSON döndür, başka hiçbir şey yazma.
        """

        ham_metin = gemini_iste(
            [prompt,
             {
                 "mime_type": "application/pdf",
                 "data": pdf_dosya.read_bytes()
             }
             ]
        ).strip()
        ham_metin = ham_metin.replace("```json", "").replace("```", "").strip()
        return json.loads(ham_metin)  # metni python sözlüğüne çevir(dict)
    except FileNotFoundError:
        return{"hata": "PDF dosyası bulunamadı."}
    except Exception as e:
        return{"hata": f"Beklenmedik bir hata oluştu: {str(e)}"}
    except json.JSONDecodeError:
        return{"hata": "LLM'den geçerli JSON gelmedi."}


# ——— CV + İlan Eşleştirme ———
def cv_ilan_eslestir(pdf_yolu: str, ilan_metni: str) -> dict:
    """CV ile iş ilanını karşılaştırıp uyum analizi yapar."""
    try:
        pdf_dosya = pathlib.Path(pdf_yolu)

        if not pdf_dosya.exists():
            return {"hata": "PDF dosyası bulunamadı."}

        prompt = f"""
        Sana bir CV (PDF) ve bir iş ilanı metni gönderiyorum.

        Önce PDF'in CV olup olmadığını kontrol et.
        Eğer CV değilse sadece şunu yaz: {{"hata": "Bu bir CV değil. Ben sadece CV analizi yapabilirim."}}

        Eğer CV ise, bu CV'nin iş ilanına uyumunu analiz et ve aşağıdaki JSON formatında döndür:

        {{
            "uyum_puani": <0-100 arası sayı - CV'nin ilana ne kadar uyduğu>,
            "eslesen_beceriler": ["beceri1", "beceri2", "beceri3"],
            "eksik_beceriler": ["beceri1", "beceri2", "beceri3"],
            "oneriler": ["öneri1", "öneri2", "öneri3"],
            "ozet": "Bu CV'nin ilana uyumu hakkında 2-3 cümlelik genel değerlendirme",
            "ik_yorumlari": {{
                "genel_degerlendirme": "Bu adayın bu pozisyon için genel uygunluğu hakkında İK uzmanı değerlendirmesi",
                "mulakat_tavsiyesi": "Bu adayla mülakatta nelere odaklanılmalı, hangi sorular sorulmalı",
                "ise_alim_riski": "Bu adayı işe almanın potansiyel riskleri ve avantajları",
                "dikkat_edilmesi_gerekenler": "İşe alım sürecinde dikkat edilmesi gereken noktalar"
            }}
        }}

        ik_yorumlari bölümünde deneyimli bir İK uzmanı gibi davran. Bu adayı bu spesifik pozisyon için değerlendir.
        Profesyonel, yapıcı ve detaylı yorumlar yaz. Her bir yorum 2-3 cümle olsun.

        İŞ İLANI METNİ:
        ---
        {ilan_metni}
        ---

        SADECE JSON döndür, başka hiçbir şey yazma.
        """

        ham_metin = gemini_iste(
            [prompt,
             {
                 "mime_type": "application/pdf",
                 "data": pdf_dosya.read_bytes()
             }
             ]
        ).strip()
        ham_metin = ham_metin.replace("```json", "").replace("```", "").strip()
        return json.loads(ham_metin)

    except FileNotFoundError:
        return {"hata": "PDF dosyası bulunamadı."}
    except json.JSONDecodeError:
        return {"hata": "LLM'den geçerli JSON gelmedi."}
    except Exception as e:
        return {"hata": f"Beklenmedik bir hata oluştu: {str(e)}"}


# ——— Endpoint: CV Analiz ———
@app.post("/analiz")

async def analiz_endpoint(dosya:UploadFile = File(...)):
    try:
        #gelen dosyayı geçici olarak kaydet
        gecici_yol = f"gecici_{dosya.filename}"
        with open(gecici_yol,"wb") as f:
            shutil.copyfileobj(dosya.file, f)


        sonuc = cv_analiz_et(gecici_yol)    
        pathlib.Path(gecici_yol).unlink()

        return sonuc
    except Exception as e:
        return {"hata":f"Beklenmedik bir hata oluştu {str(e)}"}      


# ——— Endpoint: CV + İlan Eşleştirme ———
@app.post("/eslestir")
async def eslestir_endpoint(
    dosya: UploadFile = File(...),
    ilan_url: Optional[str] = Form(None),
    ilan_metin: Optional[str] = Form(None)
):
    try:
        # En az birinin gelmesi lazım
        if not ilan_url and not ilan_metin:
            return {"hata": "İş ilanı URL'si veya metni gereklidir."}

        # Eğer URL verilmişse, ilan metnini scrape et
        ilan_icerigi = ilan_metin
        if ilan_url and not ilan_metin:
            sonuc = ilan_cek(ilan_url)
            if "hata" in sonuc:
                return sonuc
            ilan_icerigi = sonuc["metin"]

        # CV'yi geçici kaydet
        gecici_yol = f"gecici_{dosya.filename}"
        with open(gecici_yol, "wb") as f:
            shutil.copyfileobj(dosya.file, f)

        # Eşleştirme yap
        sonuc = cv_ilan_eslestir(gecici_yol, ilan_icerigi)
        pathlib.Path(gecici_yol).unlink()

        return sonuc

    except Exception as e:
        return {"hata": f"Beklenmedik bir hata oluştu: {str(e)}"}


if __name__ == "__main__":
    import uvicorn
    # Canlı sunucularda (Render, Railway vb.) port dinamik olarak atanır.
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)   