import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en"); // 'ar' أو 'en'

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  // الترجمات
  const translations = {
    en: {
      freeShipping: "Free Shipping",
      freeShippingDesc: "Free shipping all over the US",
      satisfaction: "100% Satisfaction",
      satisfactionDesc: "Top quality products, trusted by users",
      securePayments: "Secure Payments",
      securePaymentsDesc: "Your payments are safe with SSL encryption",
      support: "24/7 Support",
      supportDesc: "Round-the-clock assistance anytime",
    },
    ar: {
      freeShipping: "شحن مجاني",
      freeShippingDesc: "شحن مجاني لكل أنحاء الولايات المتحدة",
      satisfaction: "رضا 100%",
      satisfactionDesc: "منتجات عالية الجودة موثوق بها من المستخدمين",
      securePayments: "مدفوعات آمنة",
      securePaymentsDesc: "مدفوعاتك آمنة مع تشفير SSL",
      support: "دعم 24/7",
      supportDesc: "مساعدة على مدار الساعة في أي وقت",
    }
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
