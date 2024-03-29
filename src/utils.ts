export const CODE_200 = 200;
export const CODE_201 = 201;

export const ERROR_CODE_400 = 400;
export const ERROR_CODE_401 = 401;
export const ERROR_CODE_404 = 404;
export const ERROR_CODE_409 = 409;
export const ERROR_CODE_500 = 500;

export const ERROR_MESSAGE_400 = 'Переданы некорректные данные';
export const ERROR_MESSAGE_401 = 'Отказ в доступе';
export const ERROR_MESSAGE_404 = 'Запрашиваемый ресурс не найден';
export const ERROR_MESSAGE_409 = 'Пользователь с указанными данными уже существует';
export const ERROR_MESSAGE_500 = 'Ошибка сервера';

export const minLength = 2;
export const maxNameLength = 30;
export const maxAvatarLength = 30;
export const idLength = 24;
export const weekLength = '7d';

export const passwordPattern = '^[a-zA-Z0-9]{3,30}$';
export const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\/+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\/+.~#?&//=]*)/;
