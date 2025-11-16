import { useEffect, useRef } from 'react';

export const useLanyardAnimation = (isLanyardHovering, lanyardRef) => {
  const animationFrameId = useRef({});

  useEffect(() => {
    const lanyardNode = lanyardRef.current;
    if (!lanyardNode) return;
    const swingGroup = lanyardNode.querySelector('#lanyard-swing-group');
    if (!swingGroup) return;
    swingGroup.style.transformOrigin = '210.665px 0px';

    if (isLanyardHovering) {
      swingGroup.style.transition = '';
      let startTime = null;
      const swing = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const time = (timestamp - startTime) / 1000;
        const angle = 4 * Math.sin(time * 2.5);
        swingGroup.style.transform = `rotate(${angle}deg)`;
        animationFrameId.current.swing = requestAnimationFrame(swing);
      };
      animationFrameId.current.swing = requestAnimationFrame(swing);
    } else {
      cancelAnimationFrame(animationFrameId.current.swing);
      swingGroup.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      swingGroup.style.transform = 'rotate(0deg)';
    }
    return () => cancelAnimationFrame(animationFrameId.current.swing);
  }, [isLanyardHovering, lanyardRef]);
};