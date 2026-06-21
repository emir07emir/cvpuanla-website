# AI-Powered CV Analiz & İş Eşleştirme Sistemi

Bu proje, adayların CV'lerini (PDF formatında) analiz eden, puanlayan ve yapay zeka destekli İK yorumları üreten; ayrıca CV'leri belirli iş ilanları (metin veya ilan linki) ile karşılaştırarak uyumluluk analizi gerçekleştiren modern bir web uygulamasıdır.

## Proje Yapısı ve Kurulum Bilgileri

Projemiz iki ana bölümden oluşmaktadır:
1. **Backend (FastAPI & Gemini AI)**: `main.py` ve gerekli Python paketleri.
2. **Frontend (Vite, React & CSS)**: `frontend/` klasörü altındaki arayüz kodları.

---

## ⚠️ Sanal Ortam (`venv`) ve `requirements.txt` Hakkında Açıklama

Projede yer alan **`venv/`** (Virtual Environment) klasörü, Python kütüphanelerinin yüklendiği yerel bir alandır. Bu klasör bilgisayara ve işletim sistemine özel binlerce dosya içerdiğinden ve çok büyük boyutlu olduğundan **GitHub'a yüklenmez** (bu yüzden `.gitignore` dosyası ile engellenmiştir).

Bunun yerine projenin kök dizininde bulunan **`requirements.txt`** dosyası oluşturulmuştur. Bu dosya, projenin çalışması için gereken tüm kütüphaneleri listeler.

### Projeyi İlk Kez Çalıştıracaklar İçin Kurulum Adımları:

#### 1. Backend Kurulumu:
Eğer projeyi başka bir bilgisayarda çalıştırıyorsanız veya sıfırdan kuruyorsanız:

1. Terminalde projenin ana dizinine gidin.
2. Yeni bir sanal ortam oluşturun:
   ```bash
   python -m venv venv
   ```
3. Sanal ortamı aktif edin:
   * **Windows için:** `.\venv\Scripts\activate`
   * **macOS/Linux için:** `source venv/bin/activate`
4. Gerekli tüm kütüphaneleri tek seferde kurmak için şu komutu çalıştırın:
   ```bash
   pip install -r requirements.txt
   ```
5. Backend'i ayağa kaldırmak için:
   ```bash
   python main.py
   ```
   *(Backend varsayılan olarak `http://localhost:8000` adresinde çalışacaktır.)*

---



#### 2. Frontend Kurulumu:

1. `frontend` klasörüne geçiş yapın:
   ```bash
   cd frontend
   ```
2. Node.js paketlerini kurun:
   ```bash
   npm install
   ```
3. Arayüzü geliştirme modunda başlatın:
   ```bash
   npm run dev
   ```
   *(Arayüz varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.)*

---

## Kullanılan Teknolojiler

* **Backend**: Python, FastAPI, Google Generative AI (Gemini 2.5 Flash), BeautifulSoup4 (Web scraping), Uvicorn.
* **Frontend**: React, Vite, Vanilla CSS.
