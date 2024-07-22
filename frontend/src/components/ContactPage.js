import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const ContactPage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const emailData = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_email: 'YOUR_EMAIL@example.com'
    };

    console.log('Email Data:', emailData);

    emailjs.send('service_13etgfc', 'template_9f47ny7', emailData, 's1jb8V9I2e0m4ydap')
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        alert('Message sent successfully!');

        const replyData = {
          to_name: formData.name,
          from_name: 'Sql Query Team',
          to_email: formData.email
        };

        console.log('Reply Data:', replyData);

        emailjs.send('service_13etgfc', 'template_0vbxf9v', replyData, 's1jb8V9I2e0m4ydap')
          .then((response) => {
            console.log('Auto-reply sent!', response.status, response.text);
          }, (error) => {
            console.error('Failed to send auto-reply:', error);
          });

      }, (error) => {
        console.error('Failed to send message:', error);
        alert('Failed to send message. Please try again later.');
      });
  };

  return (
    <div style={styles.contactPage}>
      <div style={styles.header}>
        <h1 style={styles.headerText}>Let's have a talk</h1>
      </div>
      <div style={styles.content}>
        <div style={styles.contactInfo}>
          <h2 style={styles.subHeader}>Meet us</h2>
          <p>📞 9652122547</p>
          <p>✉️ pragniaprathapagiri@gmail.com</p>
          <p>📍 Warangal, Telangana, 506002</p>
        </div>
        <div style={styles.contactForm}>
          <h2 style={styles.subHeader}>Pitch us</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="name">Hello, my name is</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="email">and my email address is</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="message">I would like to discuss about</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                style={styles.textarea}
              ></textarea>
            </div>
            <div style={styles.formGroup}>
              <button
                type="submit"
                style={isHovered ? { ...styles.submitButton, ...styles.submitButtonHover } : styles.submitButton}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  contactPage: {
    fontFamily: 'Arial, sans-serif',
    backgroundImage: 'url(/contactimage.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    animation: 'fadeIn 1s ease-out',
    overflow: 'hidden',
  },
  header: {
    color: 'white',
    textAlign: 'center',
    padding: '50px 0',
    position: 'relative',
    backgroundColor: 'transparent',
    animation: 'slideIn 1s ease-out',
  },
  headerText: {
    fontSize: '3rem',
    margin: 0,
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
    color: '#4895ef',
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '50px',
    gap: '20px',
  },
  contactInfo: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    animation: 'fadeIn 1s ease-out',
  },
  contactForm: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    animation: 'fadeIn 1s ease-out',
  },
  subHeader: {
    fontSize: '1.5rem',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
    animation: 'fadeIn 0.5s ease-out',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  submitButton: {
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    background: 'linear-gradient(90deg, #007BFF, #00d2ff)',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'background 0.3s, transform 0.2s, color 0.3s, box-shadow 0.3s',
    position: 'relative',
    overflow: 'hidden',
  },
  submitButtonHover: {
    background: 'linear-gradient(90deg, #0056b3, #0099cc)',
    transform: 'scale(1.05)',
    color: '#f0f0f0',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
  }
};

const globalStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

export default ContactPage;
