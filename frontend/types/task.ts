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

export type Category = {
  name: 'senang' | 'sedih' | 'stress' | ''
}