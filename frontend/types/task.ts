export type Task = {
  id: number,
  name: string,
  category: string,
  status: boolean,
  date: string,
}

export type NewTask = {
  name: string,
  category: string,
  status: boolean,
  date: string,
}

export type MoodtrackerCategories = {
  name: 'senang' | 'sedih' | 'stress' | ''
}

export type LifehubCategories = {
  name: 'pribadi' | 'kerja' | 'belajar' | ''
}