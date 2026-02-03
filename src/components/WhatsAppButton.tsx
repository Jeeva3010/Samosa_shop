import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const phoneNumber = "919976715925";
  const message = encodeURIComponent(
    "Hi! I'd like to place an order from Samosa House."
  );

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button animate-pulse-glow"
    >
      <FaWhatsapp className="w-7 h-7 text-white" />
    </a>
  );
};

export default WhatsAppButton;
