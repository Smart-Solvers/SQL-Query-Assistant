import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQsPage = () => {
  const faqs = [
    {
      question: "What is SmartQuery?",
      answer: "SmartQuery is an AI-driven chat interface that helps users access and understand client data."
    },
    {
      question: "How do I get started with SmartQuery?",
      answer: "To get started, simply create an account and log in to access the chat interface."
    },
    {
      question: "How can I contact support?",
      answer: "You can contact support via the Contact Page on our website."
    }
  ];

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Frequently Asked Questions
      </Typography>
      {faqs.map((faq, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default FAQsPage;
