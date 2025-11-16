import { useEffect } from 'react';

export const usePandaInteraction = (jump, setJump, setIsHovering, svgRef) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space' && !jump) {
        event.preventDefault();
        setJump(true);
      }
    };

    const svgNode = svgRef.current;
    if (!svgNode) return () => window.removeEventListener('keydown', handleKeyDown);
    
    const head = svgNode.querySelector('.head-group');
    if (!head) return () => window.removeEventListener('keydown', handleKeyDown);

    const handleMouseMove = (event) => {
      if (jump) return;
      const pupils = svgNode.querySelector('.pupil-group');
      const { clientX, clientY } = event;
      const svgRect = svgNode.getBoundingClientRect();
      const headCenterX = svgRect.left + svgRect.width / 2;
      const headCenterY = svgRect.top + svgRect.height / 2.5;
      const deltaX = clientX - headCenterX;
      const deltaY = clientY - headCenterY;
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      const headRotation = Math.max(-15, Math.min(15, angle / 10));
      head.style.transform = `rotate(${headRotation}deg)`;

      if (pupils) {
        const pupilMoveX = Math.max(-4, Math.min(4, deltaX / 25));
        const pupilMoveY = Math.max(-3, Math.min(3, deltaY / 25));
        pupils.style.transform = `translate(${pupilMoveX}px, ${pupilMoveY}px)`;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);

    const handleMouseEnter = () => !jump && setIsHovering(true);
    const handleMouseLeave = () => {
      if(jump) return;
      const pupils = svgNode.querySelector('.pupil-group');
      setIsHovering(false);
      head.style.transform = 'rotate(0deg)'; 
      if (pupils) pupils.style.transform = 'translate(0px, 0px)';
    };
    
    svgNode.addEventListener('mouseenter', handleMouseEnter);
    svgNode.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      svgNode.removeEventListener('mouseenter', handleMouseEnter);
      svgNode.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [jump, setJump, setIsHovering, svgRef]);
};