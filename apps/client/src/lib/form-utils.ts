type DefaultValues = Record<string, string>

export function getFormDefaults(values: DefaultValues): DefaultValues {
  const isDevelopment = import.meta.env.MODE === 'development'

  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      isDevelopment ? value : '',
    ]),
  )
}

export const loginDefaults = {
  login: 'testuser',
  password: 'Test123!@#',
}

export const signupDefaults = {
  email: 'test@example.com',
  fullName: 'Test User',
  username: 'testuser',
  password: 'Test123!@#',
}
