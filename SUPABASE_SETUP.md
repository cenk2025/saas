# Supabase Setup Guide for Voon Business

Bu rehber, Voon Business platformunu Supabase ile entegre etmek için gereken adımları içerir.

## 📋 Gereksinimler

- Supabase hesabı: https://supabase.com
- Proje URL'niz: `https://uesjyfsmqwawlkgaidvv.supabase.co`
- Anon Key: `gFwVIeX0hMdN70jE`

## 🚀 Kurulum Adımları

### 1. Supabase Dashboard'a Giriş Yapın

1. https://supabase.com/dashboard adresine gidin
2. Projenizi seçin: **saasvoon**
3. Sol menüden **SQL Editor**'ı açın

### 2. Veritabanı Tablolarını Oluşturun

`supabase/schema.sql` dosyasındaki SQL kodunu kopyalayın ve SQL Editor'da çalıştırın:

```bash
# Dosya yolu:
/Users/cenkyakinlar/.gemini/antigravity/scratch/ai-saas-platform/supabase/schema.sql
```

Bu script şunları oluşturur:
- ✅ `companies` tablosu (şirket bilgileri)
- ✅ `users` tablosu (kullanıcı bilgileri)
- ✅ `diagnostic_reports` tablosu (test sonuçları)
- ✅ Row Level Security (RLS) politikaları
- ✅ İndeksler (performans için)
- ✅ Demo veriler

### 3. Environment Variables'ı Ayarlayın

`.env.local` dosyanızı oluşturun (veya güncelleyin):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://uesjyfsmqwawlkgaidvv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=gFwVIeX0hMdN70jE

# Supabase Service Role Key (Dashboard'dan alın)
# Settings > API > service_role key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database Connection String
# Settings > Database > Connection string > URI
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.uesjyfsmqwawlkgaidvv.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[YOUR-PASSWORD]@db.uesjyfsmqwawlkgaidvv.supabase.co:5432/postgres
```

**Service Role Key'i almak için:**
1. Supabase Dashboard > Settings > API
2. **service_role** key'i kopyalayın (⚠️ Dikkat: Bu key'i asla public yapmayın!)

**Database Password'ü almak için:**
1. Supabase Dashboard > Settings > Database
2. **Connection string** altında **URI** sekmesini seçin
3. Password'ü kopyalayın

### 4. Supabase Auth'u Yapılandırın (Opsiyonel)

Eğer Supabase Auth kullanmak isterseniz:

1. **Authentication > Providers** bölümüne gidin
2. Email/Password'ü aktif edin
3. OAuth providers ekleyin (Google, Microsoft, LinkedIn)

**Google OAuth için:**
- Client ID ve Secret alın: https://console.cloud.google.com
- Supabase'de Google provider'ı yapılandırın
- Redirect URL: `https://uesjyfsmqwawlkgaidvv.supabase.co/auth/v1/callback`

**Microsoft OAuth için:**
- Azure AD'de uygulama oluşturun
- Client ID ve Secret alın
- Redirect URL'i ekleyin

### 5. Row Level Security (RLS) Kontrol

RLS politikaları otomatik olarak oluşturuldu. Kontrol etmek için:

1. **Authentication > Policies** bölümüne gidin
2. Her tablo için politikaları gözden geçirin
3. Gerekirse özelleştirin

### 6. Test Verilerini Kontrol Edin

SQL Editor'da şu sorguyu çalıştırın:

```sql
-- Şirketleri listele
SELECT * FROM companies;

-- Kullanıcıları listele
SELECT * FROM users;

-- Test sonuçlarını listele
SELECT * FROM diagnostic_reports;
```

Demo veriler:
- **Şirket:** Acme Corporation, TechStart Oy
- **Kullanıcılar:** admin@acme.com, manager@acme.com, employee@acme.com

## 🔧 Geliştirme Ortamında Test

1. Development server'ı başlatın:
```bash
npm run dev
```

2. Tarayıcıda açın: http://localhost:3002

3. Demo credentials ile giriş yapın:
   - Email: `admin@acme.com`
   - Password: (NextAuth ile ayarlanacak)

## 📊 Dashboard Özellikleri

Dashboard artık Supabase'den veri çekiyor:

- ✅ Kullanıcı bilgileri
- ✅ Şirket bilgileri
- ✅ Tüm test sonuçları (diagnostic reports)
- ✅ Geçmiş performans grafikleri
- ✅ Risk analizi
- ✅ AI önerileri

## 🔐 Güvenlik Notları

1. **Service Role Key'i asla client-side'da kullanmayın**
2. **RLS politikalarını her zaman aktif tutun**
3. **Production'da güçlü şifreler kullanın**
4. **API rate limiting'i yapılandırın**

## 🚨 Sorun Giderme

### Bağlantı Hatası
```
Error: Could not connect to Supabase
```
**Çözüm:** Environment variables'ları kontrol edin.

### RLS Hatası
```
Error: Row Level Security policy violation
```
**Çözüm:** Kullanıcının company_id'si doğru mu kontrol edin.

### Auth Hatası
```
Error: User not found
```
**Çözüm:** Kullanıcı Supabase'de kayıtlı mı kontrol edin.

## 📚 Kaynaklar

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## ✅ Checklist

- [ ] SQL schema'yı çalıştırdım
- [ ] Environment variables'ları ayarladım
- [ ] Service role key'i aldım
- [ ] Database password'ü ayarladım
- [ ] RLS politikalarını kontrol ettim
- [ ] Demo verileri gördüm
- [ ] Development server'da test ettim
- [ ] Dashboard'da test sonuçlarını gördüm

## 🎉 Tamamlandı!

Artık Voon Business platformu Supabase ile entegre! Kullanıcılar dashboard'larında tüm test sonuçlarını görebilirler.
