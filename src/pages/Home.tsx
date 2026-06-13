import { useEffect, useRef } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Work from '../components/Work';
import Skills from '../components/Skills';
import Approach from '../components/Approach';
import Contact from '../components/Contact';
import { useReveals } from '../hooks/useReveals';

const Home: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useReveals(ref);

  useEffect(() => {
    document.title = 'Rahul Bonala — Product Designer & Developer';
  }, []);

  return (
    <div ref={ref}>
      <Hero />
      <About />
      <Work />
      <Skills />
      <Approach />
      <Contact />
    </div>
  );
};

export default Home;
