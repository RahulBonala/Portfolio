import { useEffect, useRef } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Work from '../components/Work';
import YouTube from '../components/YouTube';
import Skills from '../components/Skills';
import Approach from '../components/Approach';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import { useReveals } from '../hooks/useReveals';

const Home: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useReveals(ref);

  useEffect(() => {
    document.title = 'Rahul Bonala - Product Designer & AI Builder at Ginthi.ai';
  }, []);

  return (
    <div ref={ref}>
      <Hero />
      <About />
      <Work />
      <YouTube />
      <Skills />
      <Approach />
      <Testimonials variant="page" />
      <Contact />
    </div>
  );
};

export default Home;
