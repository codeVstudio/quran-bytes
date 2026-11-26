import type { SurahMeta, SurahWithTranslation, TranslationEditionOption } from '@/@types/quran'

export const TRANSLATION_EDITIONS: TranslationEditionOption[] = [
  {
    id: 'en.sahih',
    label: 'Saheeh International',
    language: 'English',
    translator: 'Saheeh International',
  },
  {
    id: 'en.yusufali',
    label: 'Abdullah Yusuf Ali',
    language: 'English',
    translator: 'Abdullah Yusuf Ali',
  },
  {
    id: 'en.asad',
    label: 'Muhammad Asad',
    language: 'English',
    translator: 'The Message of The Qur’an',
  },
  {
    id: 'en.pickthall',
    label: 'Marmaduke Pickthall',
    language: 'English',
    translator: 'Mohammed Marmaduke Pickthall',
  },
  {
    id: 'ur.jalandhry',
    label: 'Fateh Muhammad Jalandhry',
    language: 'Urdu',
    translator: 'فتح محمد جالندھری',
  },
]

export const FALLBACK_SURAH_LIST: SurahMeta[] = [
  {
    number: 1,
    name: 'سُورَةُ ٱلْفَاتِحَةِ',
    englishName: 'Al-Faatiha',
    englishNameTranslation: 'The Opening',
    numberOfAyahs: 7,
    revelationType: 'Meccan',
  },
  {
    number: 73,
    name: 'سُورَةُ المُزَّمِّلِ',
    englishName: 'Al-Muzzammil',
    englishNameTranslation: 'The Enshrouded One',
    numberOfAyahs: 20,
    revelationType: 'Meccan',
  },
  {
    number: 94,
    name: 'سُورَةُ الشَّرْحِ',
    englishName: 'Ash-Sharh',
    englishNameTranslation: 'The Relief',
    numberOfAyahs: 8,
    revelationType: 'Meccan',
  },
  {
    number: 112,
    name: 'سُورَةُ الإِخْلَاصِ',
    englishName: 'Al-Ikhlaas',
    englishNameTranslation: 'Sincerity',
    numberOfAyahs: 4,
    revelationType: 'Meccan',
  },
  {
    number: 113,
    name: 'سُورَةُ الفَلَقِ',
    englishName: 'Al-Falaq',
    englishNameTranslation: 'The Dawn',
    numberOfAyahs: 5,
    revelationType: 'Meccan',
  },
  {
    number: 114,
    name: 'سُورَةُ النَّاسِ',
    englishName: 'An-Naas',
    englishNameTranslation: 'Mankind',
    numberOfAyahs: 6,
    revelationType: 'Meccan',
  },
]

export const FALLBACK_SURAHS: Record<number, SurahWithTranslation> = {
  1: {
    meta: FALLBACK_SURAH_LIST[0],
    editionId: 'en.sahih',
    editionName: 'Saheeh International (Offline Excerpt)',
    isFallback: true,
    ayahs: [
      {
        number: 1,
        numberInSurah: 1,
        arabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
      },
      {
        number: 2,
        numberInSurah: 2,
        arabic: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
        translation: '[All] praise is [due] to Allah, Lord of the worlds —',
      },
      {
        number: 3,
        numberInSurah: 3,
        arabic: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        translation: 'The Entirely Merciful, the Especially Merciful,',
      },
      {
        number: 4,
        numberInSurah: 4,
        arabic: 'مَٰلِكِ يَوْمِ ٱلدِّينِ',
        translation: 'Sovereign of the Day of Recompense.',
      },
      {
        number: 5,
        numberInSurah: 5,
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        translation: 'It is You we worship and You we ask for help.',
      },
      {
        number: 6,
        numberInSurah: 6,
        arabic: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ',
        translation: 'Guide us to the straight path —',
      },
      {
        number: 7,
        numberInSurah: 7,
        arabic: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ',
        translation:
          'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
      },
    ],
  },
  94: {
    meta: FALLBACK_SURAH_LIST[2],
    editionId: 'en.sahih',
    editionName: 'Saheeh International (Offline Excerpt)',
    isFallback: true,
    ayahs: [
      {
        number: 6091,
        numberInSurah: 1,
        arabic: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ',
        translation: 'Did We not expand for you, [O Muhammad], your breast?',
      },
      {
        number: 6092,
        numberInSurah: 2,
        arabic: 'وَوَضَعْنَا عَنكَ وِزْرَكَ',
        translation: 'And We removed from you your burden',
      },
      {
        number: 6093,
        numberInSurah: 3,
        arabic: 'ٱلَّذِىٓ أَنقَضَ ظَهْرَكَ',
        translation: 'Which had weighed upon your back',
      },
      {
        number: 6094,
        numberInSurah: 4,
        arabic: 'وَرَفَعْنَا لَكَ ذِكْرَكَ',
        translation: 'And raised high for you your repute.',
      },
      {
        number: 6095,
        numberInSurah: 5,
        arabic: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',
        translation: 'For indeed, with hardship [will be] ease.',
      },
      {
        number: 6096,
        numberInSurah: 6,
        arabic: 'إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',
        translation: 'Indeed, with hardship [will be] ease.',
      },
      {
        number: 6097,
        numberInSurah: 7,
        arabic: 'فَإِذَا فَرَغْتَ فَٱنصَبْ',
        translation: 'So when you have finished [your duties], then stand up [for worship].',
      },
      {
        number: 6098,
        numberInSurah: 8,
        arabic: 'وَإِلَىٰ رَبِّكَ فَٱرْغَب',
        translation: 'And to your Lord direct [your] longing.',
      },
    ],
  },
  112: {
    meta: FALLBACK_SURAH_LIST[3],
    editionId: 'en.sahih',
    editionName: 'Saheeh International (Offline Excerpt)',
    isFallback: true,
    ayahs: [
      {
        number: 6222,
        numberInSurah: 1,
        arabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
        translation: 'Say, "He is Allah, [who is] One,',
      },
      {
        number: 6223,
        numberInSurah: 2,
        arabic: 'ٱللَّهُ ٱلصَّمَدُ',
        translation: 'Allah, the Eternal Refuge.',
      },
      {
        number: 6224,
        numberInSurah: 3,
        arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        translation: 'He neither begets nor is born,',
      },
      {
        number: 6225,
        numberInSurah: 4,
        arabic: 'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ',
        translation: 'Nor is there to Him any equivalent."',
      },
    ],
  },
}
