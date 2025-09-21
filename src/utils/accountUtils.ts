export const generateAccountNumber = (): string => {
  const firstGroup = Math.floor(Math.random() * 9000) + 1000;

  const secondGroup = Math.floor(Math.random() * 900000) + 100000;

  return `${firstGroup}-${secondGroup}`;
};

export const createAccountInfo = () => {
  return {
    accountNumber: generateAccountNumber(),
    currency: "TL",
    balance: 0,
    accountType: "Vadesiz Hesap",
    status: "Aktif",
    openDate: new Date(),
  };
};
