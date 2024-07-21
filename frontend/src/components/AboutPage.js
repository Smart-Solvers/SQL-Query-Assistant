import React from 'react';
import { Box, Container, Typography, Paper, Grid, Avatar } from '@mui/material';
import { styled } from '@mui/system';

const HeroSection = styled(Box)(({ theme }) => ({
    height: '40vh',
    background: `url('/aboutt.jpg') no-repeat center center`,
    backgroundSize: 'cover',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      height: '30vh',
    },
  }));
  

const HeroText = styled(Typography)(({ theme }) => ({
  color: '#003366', // Blue color
  fontSize: '4rem',
  fontWeight: 700,
  fontFamily: '"Montserrat", sans-serif',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
  textAlign: 'center',
  padding: '0 20px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '3rem',
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginTop: '-60px',
  [theme.breakpoints.down('sm')]: {
    marginTop: '-30px',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '32px',
  backgroundColor: '#FFFFFF',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  [theme.breakpoints.down('sm')]: {
    padding: '24px',
  },
}));

const Section = styled(Box)(({ theme }) => ({
  padding: '40px 0',
  '&:not(:last-child)': {
    borderBottom: '1px solid #E0E0E0',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '32px 0',
  },
}));

const SectionText = styled(Typography)({
  fontFamily: '"Montserrat", sans-serif',
  fontSize: '2rem',
  fontWeight: 600,
  marginBottom: '24px',
  color: '#003366',
});

const SectionBody = styled(Typography)({
  fontFamily: '"Roboto", sans-serif',
  fontSize: '1rem',
  lineHeight: 1.6,
  color: '#333333',
});

const TeamMember = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  padding: '20px',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
}));

const AvatarStyled = styled(Avatar)({
  width: 120,
  height: 120,
  margin: '0 auto 16px',
  border: '3px solid #003366',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
});

const AboutPage = () => {
  return (
    <Box>
      <HeroSection>
        <HeroText variant="h1">
          About Us
        </HeroText>
      </HeroSection>
      <Container maxWidth="md">
        <ContentWrapper>
          <StyledPaper elevation={3}>
            <Section>
              <SectionText variant="h2" gutterBottom>
                Our Mission
              </SectionText>
              <SectionBody>
                We are committed to addressing the challenges organizations face in efficiently accessing and understanding client data stored in internal databases. Our goal is to streamline data retrieval and analysis processes, enabling timely and accurate decision-making through innovative solutions.
              </SectionBody>
            </Section>
            <Section>
              <SectionText variant="h2" gutterBottom>
                Our Solution
              </SectionText>
              <SectionBody>
                We've developed an AI-powered data query interface that leverages Large Language Models (LLMs) to provide a user-friendly chat interface. This solution allows organization members to query their internal databases effortlessly, obtaining accurate and contextually relevant insights that enhance decision-making and improve client management.
              </SectionBody>
            </Section>
            <Section>
              <SectionText variant="h2" gutterBottom>
                How It Works
              </SectionText>
              <SectionBody>
                Our interface simplifies data interaction by:
                <ul>
                  <li><strong>Querying Intuitively:</strong> Use natural language to ask questions and retrieve data without complex queries.</li>
                  <li><strong>Providing Accurate Insights:</strong> Receive timely, relevant answers based on the data in your internal systems.</li>
                  <li><strong>Enhancing Decision-Making:</strong> Utilize actionable insights to make informed decisions quickly.</li>
                </ul>
              </SectionBody>
            </Section>
            <Section>
              <SectionText variant="h2" gutterBottom>
                Meet the Team
              </SectionText>
              <Grid container spacing={4}>
                {['Sai Varshith', 'Pragnia', 'Kishore'].map((name, index) => (
                  <Grid item xs={12} sm={4} key={name}>
                    <TeamMember>
                      <AvatarStyled alt={name} src={`/team-member-${index + 1}.jpg`} />
                      <Typography variant="h6" fontWeight={500}>{name}</Typography>
                      <Typography variant="body2">{['Lead Developer', 'UI/UX Designer', 'Product Manager'][index]}</Typography>
                    </TeamMember>
                  </Grid>
                ))}
              </Grid>
            </Section>
          </StyledPaper>
        </ContentWrapper>
      </Container>
    </Box>
  );
};

export default AboutPage;