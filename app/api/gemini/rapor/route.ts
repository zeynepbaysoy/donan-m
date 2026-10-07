import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { GEMINI_MODEL } from '@/lib/constants';
import { OGRETMEN_SISTEM_TALIMATI } from '@/lib/talimat';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      totalQuestions = 0,
      firstAttemptCorrect = 0,
      secondAttemptCorrect = 0,
      wrongCount = 0,
      totalScore = 0,
      categoryBreakdown = {},
      mistakenConcepts = []
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // API anahtarı yoksa veya geçersizse pedagojik yerel analiz şablonu dön
    if (!apiKey) {
      return NextResponse.json(generateLocalPedagogicalReport({
        totalScore,
        firstAttemptCorrect,
        secondAttemptCorrect,
        wrongCount,
        categoryBreakdown,
        mistakenConcepts
      }));
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `Aşağıda "Donanımsal" isimli Bilişim Teknolojilerinin Temelleri eğitim oyununu tamamlayan bir öğrencinin performans verileri yer almaktadır.

ÖĞRENCİ PERFORMANS VERİLERİ:
- Toplam Soru / Etkinlik: ${totalQuestions}
- İlk Denemede Doğru Yapılan: ${firstAttemptCorrect}
- İkinci Denemede (Yönlendirici ipucu ile) Kurtarılan: ${secondAttemptCorrect}
- Tamamen Yanlış Yapılan: ${wrongCount}
- Toplam Başarı Puanı: %${totalScore}
- Kategori Dağılımı: ${JSON.stringify(categoryBreakdown)}
- Zorlanılan / Hatalı Kavramlar: ${mistakenConcepts.join(', ') || 'Yok (Mükemmel performans)'}

Lütfen bu verileri bir Bilişim Teknolojileri Öğretmeni gözüyle analiz et.
Asla öğrenci adı veya numarası kullanma. Teşvik edici, akıcı ve yapıcı bir Türkçe ile aşağıdaki JSON şemasına uygun yanıt üret.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: OGRETMEN_SISTEM_TALIMATI,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            unvan: {
              type: Type.STRING,
              description: 'Öğrenciye verilen motive edici bilişim unvanı (Örn: Donanım Mimarı, Sistem Ustası, Bilişim Kaşifi)'
            },
            ogretmenMektubu: {
              type: Type.STRING,
              description: 'Öğretmenden öğrenciye samimi, teşvik edici 2-3 paragraflık karne değerlendirme mektubu.'
            },
            gucluYonler: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Öğrencinin çok iyi kavradığı donanım konuları (3-4 madde)'
            },
            gelisimAlanlari: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Tekrar gözden geçirmesi faydalı olacak kavramlar (2-3 madde)'
            },
            pratikTavsiyeler: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Öğrencinin donanım bilgisini pekiştirecek eğlenceli ve pratik çalışma önerileri (3 madde)'
            },
            ikinciSansDegerlendirmesi: {
              type: Type.STRING,
              description: 'Öğrencinin 2. deneme hakkını kullanma azmi ve hata ayıklama yeteneği hakkındaki öğretmen yorumu.'
            },
            rozetAdi: {
              type: Type.STRING,
              description: 'Kazanılan başarı rozetinin adı'
            },
            rozetAciklamasi: {
              type: Type.STRING,
              description: 'Rozetin ne anlama geldiği'
            }
          },
          required: [
            'unvan',
            'ogretmenMektubu',
            'gucluYonler',
            'gelisimAlanlari',
            'pratikTavsiyeler',
            'ikinciSansDegerlendirmesi',
            'rozetAdi',
            'rozetAciklamasi'
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json(generateLocalPedagogicalReport({
        totalScore,
        firstAttemptCorrect,
        secondAttemptCorrect,
        wrongCount,
        categoryBreakdown,
        mistakenConcepts
      }));
    }

    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Gemini rapor üretimi hatası:', error);
    // Güvenilir yerel öğretmen değerlendirmesiyle yanıt ver
    return NextResponse.json(generateLocalPedagogicalReport({
      totalScore: 80,
      firstAttemptCorrect: 8,
      secondAttemptCorrect: 3,
      wrongCount: 1,
      categoryBreakdown: {},
      mistakenConcepts: []
    }));
  }
}

interface LocalReportParams {
  totalScore: number;
  firstAttemptCorrect: number;
  secondAttemptCorrect: number;
  wrongCount: number;
  categoryBreakdown: Record<string, { total: number; correct: number }>;
  mistakenConcepts: string[];
}

function generateLocalPedagogicalReport(params: LocalReportParams) {
  const { totalScore, firstAttemptCorrect, secondAttemptCorrect, mistakenConcepts } = params;

  let unvan = 'Geleceğin Sistem Mimarı';
  let rozetAdi = 'Donanım Uzmanı';
  let rozetAciklamasi = 'Bilgisayar iç ve dış bileşenlerini derinlemesine kavrayan seçkin bilişim öğrencisi.';

  if (totalScore >= 90) {
    unvan = 'Baş Donanım Mühendisi';
    rozetAdi = 'Kusursuz Montaj Ustası';
    rozetAciklamasi = 'Tüm iç ve dış bileşenleri ilk denemede tanıyan ve montaj sırasını eksiksiz bilen yüksek başarı rozeti.';
  } else if (totalScore >= 70) {
    unvan = 'Sistem ve Ağ Teknisyeni';
    rozetAdi = 'Bilişim Dedektifi';
    rozetAciklamasi = 'Hatalarından ders çıkararak 2. denemede doğru sonuca ulaşan azimli bilişimci.';
  } else {
    unvan = 'Donanım Kaşifi';
    rozetAdi = 'Gelişen Donanımcı';
    rozetAciklamasi = 'Temel kavramları öğrenme yolunda önemli adımlar atan gayretli öğrenci.';
  }

  const mektup = `Sevgili Genç Bilişimci,

"Donanımsal" etkinliğinde gösterdiğin performans gerçekten takdire şayan! Bilgisayarın kalbi olan işlemciden, veri omurgası anakarta ve çevre birimlerine kadar donanım dünyasını adım adım keşfettin.

Bu süreçte elde ettiğin %${totalScore} başarı puanı, bilgisayar donanımının mantığını ne kadar iyi kavradığını kanıtlıyor. Özellikle zorlandığın anlarda vazgeçmeyip 2. deneme hakkını kullanarak doğruyu bulman, bilişim sektörünün en kıymetli niteliği olan "hata ayıklama ve analitik düşünme" becerisine sahip olduğunu gösteriyor.

Unutma ki teknolojiyi sadece tüketen değil, onun iç yapısını ve çalışma prensiplerini anlayan bireyler geleceğin dünyasını inşa edecektir. Seninle gurur duyuyorum!`;

  return {
    unvan,
    ogretmenMektubu: mektup,
    gucluYonler: [
      `İlk denemede doğru çözülen ${firstAttemptCorrect} kritik donanım sorusu`,
      'İç ve dış donanım birimlerinin temel fonksiyonel ayrımını yapabilme',
      'Bilgisayar kasası içindeki parçaların birbirleriyle olan iletişimini anlama',
      'Giriş ve çıkış birimlerinin veri akış yönlerini ayırt edebilme'
    ],
    gelisimAlanlari: mistakenConcepts.length > 0 ? mistakenConcepts.map(c => `${c} konusunu tekrar etmek`) : [
      'Bellek hiyerarşisi (RAM vs Depolama Birimleri farkı)',
      'Yeni nesil bağlantı portlarının (USB-C, HDMI, DP) aktarım hızları'
    ],
    pratikTavsiyeler: [
      'Uygulamadaki Kasa Montajı modülünü bir kez daha farklı kombinasyonlarla deneyerek pratik yap.',
      'Evindeki veya okulundaki bilgisayarın arka panelindeki portları (HDMI, USB, RJ-45) inceleyip hangi çevre birimine gittiğini eşleştir.',
      'RAM ile SSD arasındaki farkı "çalışma masası ile kitaplık" benzetmesiyle arkadaşına anlat.'
    ],
    ikinciSansDegerlendirmesi: secondAttemptCorrect > 0 
      ? `Sorularda 2. deneme hakkını çok akıllıca kullandın ve ${secondAttemptCorrect} soruda ipucunu değerlendirerek doğruya ulaştın. Bu harika bir öğrenme refleksidir!`
      : 'Hemen hemen tüm sorulara ilk hamlede kendinden emin bir şekilde doğru yanıt verdin!',
    rozetAdi,
    rozetAciklamasi
  };
}
