import React from 'react';

const Features = () => {
  const features = [
    {
      icon: "fa-solid fa-truck-fast",
      title: "Free Shipping",
      description: "Free shipping all over the US",
      gradient: "from-[#3785D8] to-[#BF8CE1]"
    },
    {
      icon: "fa-solid fa-user-check",
      title: "100% Satisfaction",
      description: "Top quality products, trusted by users",
      gradient: "from-[#BF8CE1] to-[#3785D8]"
    },
    {
      icon: "fa-solid fa-credit-card",
      title: "Secure Payments",
      description: "Your payments are safe with SSL encryption",
      gradient: "from-[#3785D8] to-[#E893C5]"
    },
    {
      icon: "fa-solid fa-headset",
      title: "24/7 Support",
      description: "Round-the-clock assistance anytime",
      gradient: "from-[#E893C5] to-[#BF8CE1]"
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
      <div className="feature-content-spec">
        <div className="feature-icon-container-spec">
          <div className={`feature-icon-bg-spec bg-gradient-to-r ${gradient}`}>
            <i className={icon} aria-hidden="true"></i>
          </div>
        </div>

        <div className="feature-text-spec">
          <h3 className="feature-title-spec">{title}</h3>
          {description && (
            <p className="feature-description-spec">{description}</p>
          )}
        </div>
      </div>

      <div className="feature-glow-spec" aria-hidden="true"></div>
    </article>
  );
};

export default Features;

