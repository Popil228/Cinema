import { useState, useEffect } from 'react';

const useWindowWidth = (): number => {
    const [windowWidth, setWindowWidth] = useState<number>(67)

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth;
};

export default useWindowWidth;