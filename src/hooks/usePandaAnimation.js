import { useEffect, useRef } from 'react';

export const usePandaAnimation = (jump, setJump, svgRef) => {
  const animationFrameId = useRef({});

  useEffect(() => {
    if (!jump) return;
    const pandaBody = svgRef.current?.querySelector('#panda-body-jump-group');
    const leftArm = svgRef.current?.querySelector('#tangan_kiri_group');
    const rightArm = svgRef.current?.querySelector('#tangan_kanan_group');
    const shadow = document.querySelector('.shadow');
    
    if (!pandaBody || !leftArm || !rightArm || !shadow) return;
    
    const jumpDuration = 800;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / jumpDuration, 1);
      const jumpHeight = Math.sin(progress * Math.PI) * 80;
      pandaBody.style.transform = `translateY(${-jumpHeight}px)`;
      let angle = (progress < 0.5) ? (progress * 2) * 45 : ((1 - progress) * 2) * 45;
      leftArm.style.transform = `rotate(${angle}deg)`;
      rightArm.style.transform = `rotate(${-angle}deg)`;
      const shadowScale = 1 - (Math.sin(progress * Math.PI) * 0.3);
      shadow.style.transform = `scale(${shadowScale})`;
      shadow.style.opacity = 0.15 * (1 - Math.sin(progress * Math.PI) * 0.5);

      if (progress < 1) {
        animationFrameId.current.jump = requestAnimationFrame(animate);
      } else {
        pandaBody.style.transform = 'translateY(0px)';
        leftArm.style.transform = 'rotate(0deg)';
        rightArm.style.transform = 'rotate(0deg)';
        shadow.style.transform = 'scale(1)';
        shadow.style.opacity = '0.15';
        setJump(false);
      }
    };
    animationFrameId.current.jump = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId.current.jump);
  }, [jump, setJump, svgRef]);
};