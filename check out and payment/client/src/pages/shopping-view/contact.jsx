import React, { useState } from "react";
import axios from "axios";
import {
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/contact", formData);
      setStatus("✅ Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("❌ Something went wrong. Please try again.");
      console.log(err);
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center py-10 px-6"
      style={{ background: "#E3EAF2" }}
    >
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden">
        <div
          className="text-white flex flex-col justify-center p-10"
          style={{ background: "linear-gradient(135deg, #1E0F75, #3785D8)" }}
        >
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-blue-100 mb-6 leading-relaxed">
            Have any questions or need help? Feel free to reach out to us
            through the following contact details.
          </p>

          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <FaMapMarkerAlt className="text-2xl" />
              <span>Alexandria, Egypt</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaPhoneAlt className="text-2xl" />
              <span>+20 111 234 5678</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-2xl" />
              <span>support@yourcompany.com</span>
            </div>
          </div>

          <div className="flex space-x-4 mt-8 text-2xl">
            <a href="#" className="hover:text-blue-300 transition-colors"><FaFacebook /></a>
            <a href="#" className="hover:text-blue-300 transition-colors"><FaLinkedin /></a>
            <a href="#" className="hover:text-blue-300 transition-colors"><FaTwitter /></a>
            <a href="#" className="hover:text-blue-300 transition-colors"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-300 transition-colors"><FaWhatsapp /></a>
          </div>
        </div>

        <div className="p-10 bg-white">
          <h2 className="text-3xl font-bold text-[#1E0F75] mb-4">Contact Us</h2>
          <p className="text-gray-500 mb-6">
            We'd love to hear from you! Fill out the form below and our team will get back to you soon.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#3785D8] outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#3785D8] outline-none"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#3785D8] outline-none"
            ></textarea>

            <button
              type="submit"
              className="w-full text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(135deg, #1E0F75, #3785D8)" }}
            >
              Send Message
            </button>
          </form>

          {status && (
            <p className="mt-4 text-center text-sm text-gray-600">{status}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactPage;

