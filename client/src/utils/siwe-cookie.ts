import Cookies from 'js-cookie';

const cookieName = 'siwe-integration';

export const getSiweCookie = (): string | undefined => {
	return Cookies.get(cookieName);
};