export const PROFESSIONS = [
  'Doktor', 'Mühendis', 'Öğretmen', 'Avukat', 'Hemşire', 'Polis', 'Asker',
  'Muhasebeci', 'Pazarlama Uzmanı', 'Satış Temsilcisi', 'Tekniker', 
  'Bankacı', 'Emlakçı', 'Berber/Kuaför', 'Şoför', 'Aşçı', 'Garson',
  'İnşaat İşçisi', 'Temizlik Görevlisi', 'Güvenlik Görevlisi', 'Öğrenci',
  'Emekli', 'Ev Hanımı', 'Serbest Meslek', 'Diğer'
]

export interface MockUserData {
  name: string
  email: string
  age: string
  profession: string
  experience: string
  sector: string
  salary: string
  additionalIncome: string
}

export const MOCK_USERS: MockUserData[] = [
  {
    name: 'Ali Yılmaz',
    email: 'ali.yilmaz@gmail.com',
    age: '32',
    profession: 'Mühendis',
    experience: '8',
    sector: 'ozel',
    salary: '45000',
    additionalIncome: '5000'
  },
  {
    name: 'Ayşe Kaya',
    email: 'ayse.kaya@hotmail.com',
    age: '28',
    profession: 'Doktor',
    experience: '5',
    sector: 'kamu',
    salary: '62000',
    additionalIncome: '8000'
  },
  {
    name: 'Mehmet Demir',
    email: 'mehmet.demir@outlook.com',
    age: '35',
    profession: 'Bankacı',
    experience: '12',
    sector: 'ozel',
    salary: '55000',
    additionalIncome: '10000'
  },
  {
    name: 'Fatma Şahin',
    email: 'fatma.sahin@gmail.com',
    age: '29',
    profession: 'Öğretmen',
    experience: '6',
    sector: 'kamu',
    salary: '25000',
    additionalIncome: '3000'
  },
  {
    name: 'Burak Özkan',
    email: 'burak.ozkan@gmail.com',
    age: '31',
    profession: 'Pazarlama Uzmanı',
    experience: '9',
    sector: 'ozel',
    salary: '38000',
    additionalIncome: '7000'
  }
]

export const MOCK_LOGIN_DATA = {
  email: 'ali.yilmaz@gmail.com',
  password: 'test123456'
}

export class FormService {
  static getRandomMockUser(): MockUserData {
    return MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)]
  }

  static getMockPassword(): string {
    return 'test123456'
  }

  static validateRegistrationForm(data: {
    password: string
    confirmPassword: string
    age: string
    profession: string
    sector: string
  }): { isValid: boolean; error?: string } {
    if (data.password !== data.confirmPassword) {
      return { isValid: false, error: 'Şifreler eşleşmiyor!' }
    }
    
    if (data.password.length < 6) {
      return { isValid: false, error: 'Şifre en az 6 karakter olmalıdır!' }
    }

    if (parseInt(data.age) < 18) {
      return { isValid: false, error: '18 yaşından küçük olamazsınız!' }
    }

    if (!data.profession) {
      return { isValid: false, error: 'Lütfen mesleğinizi seçiniz!' }
    }

    if (!data.sector) {
      return { isValid: false, error: 'Lütfen çalıştığınız sektörü seçiniz!' }
    }

    return { isValid: true }
  }

  static prepareUserData(formData: {
    age: string
    profession: string
    experience: string
    sector: string
    salary: string
    additionalIncome: string
  }) {
    return {
      age: parseInt(formData.age),
      profession: formData.profession,
      experience: parseInt(formData.experience) || 0,
      sector: formData.sector,
      salary: parseInt(formData.salary) || 0,
      additionalIncome: parseInt(formData.additionalIncome) || 0
    }
  }
}