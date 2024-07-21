import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Styled Components
const ContactContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f9f9f9;
  background-image: url('/download.jpg'); /* Ensure the path is correct */
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: auto;
  width: 90%;
  opacity: 0;
  animation: ${fadeIn} 1s forwards;
`;

const ContactHeading = styled.h1`
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 2rem;
  animation: ${slideIn} 0.5s ease-out;
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ContactLabel = styled.label`
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #555;
  display: flex;
  flex-direction: column;
  font-weight: bold;
  opacity: 0;
  animation: ${fadeIn} 0.5s forwards 0.5s; /* Delay for staggered effect */
`;

const ContactInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => (props.error ? 'red' : '#ddd')};
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
`;

const ContactTextarea = styled.textarea`
  width: 100%;
  height: 150px;
  resize: vertical;
  padding: 0.75rem;
  border: 1px solid ${props => (props.error ? 'red' : '#ddd')};
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const ContactButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

// Main Component
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (data) => {
    const errors = {};
    if (!data.name) {
      errors.name = 'Name is required';
    }
    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Invalid email address';
    }
    if (!data.message) {
      errors.message = 'Message is required';
    }
    return errors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setTouched({
      ...touched,
      [name]: true,
    });
    setErrors(validate({
      ...formData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length === 0) {
      // Submit form data
      console.log('Form submitted successfully:', formData);
    } else {
      // Set errors
      setErrors(validationErrors);
    }
  };

  return (
    <ContactContainer>
      <ContactHeading>Contact Us</ContactHeading>
      <ContactForm onSubmit={handleSubmit}>
        <ContactLabel htmlFor="name" error={errors.name}>
          Name:
          <ContactInput
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => setTouched({ ...touched, name: true })}
            aria-required="true"
            error={errors.name}
          />
          {touched.name && errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </ContactLabel>
        <ContactLabel htmlFor="email" error={errors.email}>
          Email:
          <ContactInput
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => setTouched({ ...touched, email: true })}
            aria-required="true"
            error={errors.email}
          />
          {touched.email && errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </ContactLabel>
        <ContactLabel htmlFor="message" error={errors.message}>
          Message:
          <ContactTextarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={() => setTouched({ ...touched, message: true })}
            aria-required="true"
            error={errors.message}
          />
          {touched.message && errors.message && <ErrorMessage>{errors.message}</ErrorMessage>}
        </ContactLabel>
        <ContactButton type="submit">Send</ContactButton>
      </ContactForm>
    </ContactContainer>
  );
};

export default ContactPage;
