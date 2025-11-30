// Features.jsx
import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';


const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: "fa-solid fa-truck-fast",
      title: t.freeShipping || "Free Shipping",
      description: t.freeShippingDesc || "Free shipping all over the US",
      gradient: "from-bright-blue to-light-purple"
    },
    {
      icon: "fa-solid fa-user-check",
      title: t.satisfaction || "100% Satisfaction",
      description: t.satisfactionDesc || "Top quality products, trusted by users",
      gradient: "from-light-purple to-bright-blue"
    },
    {
      icon: "fa-solid fa-credit-card",
      title: t.securePayments || "Secure Payments",
      description: t.securePaymentsDesc || "Your payments are safe with SSL encryption",
      gradient: "from-bright-blue to-accent-pink"
    },
    {
      icon: "fa-solid fa-headset",
      title: t.support || "24/7 Support",
      description: t.supportDesc || "Round-the-clock assistance anytime",
      gradient: "from-accent-pink to-light-purple"
    }
  ];

  return (
    <section className="features-container-spec">
      <div className="features-grid-spec">
        {features.map((feature, index) => (
          <FeatureBox
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            gradient={feature.gradient}
          />
        ))}
      </div>
    </section>
  );
};

const FeatureBox = ({ icon, title, description, gradient }) => {
  return (
    <article 
      className="feature-box-spec group"
      aria-label={title}
    >
      {/* Main Content */}
      <div className="feature-content-spec">
        {/* Icon Container */}
        <div className="feature-icon-container-spec">
          <div className={`feature-icon-bg-spec bg-gradient-to-r ${gradient}`}>
            <i className={icon} aria-hidden="true"></i>
          </div>
        </div>

        {/* Text Content */}
        <div className="feature-text-spec">
          <h3 className="feature-title-spec">{title}</h3>
          {description && (
            <p className="feature-description-spec">{description}</p>
          )}
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="feature-glow-spec" aria-hidden="true"></div>
    </article>
  );
};

export default Features;