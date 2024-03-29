import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, CustomEase);

function animateDiagramDesktop() {
  const drawingContainer = document.querySelector('.trendradar_component.is-desktop');
  // Fetch the svg from github and append to the embed div
  const diagram =
    'https://gist.githubusercontent.com/maray29/e78f6255dd37f1651ac6ddd97cebba1b/raw/b930f618f84973701757899168fea16103e2e8df/haufe-trendradar.html';

  fetch(diagram)
    .then((response) => response.text())
    .then((data) => {
      // const terrainLines = document.querySelector(".terrain-lines");
      drawingContainer.insertAdjacentHTML('beforeend', data);
    })
    .then((data) => {
      const linesAndTexts = gsap.utils.toArray(['.group-1', '.group-2', '.group-3', '.group-4']);
      const groups = drawingContainer?.querySelectorAll(
        '.global-talent, .sustainability-management, .people-culture, .digital-transformation, .data-intelligence, .ai-strategy, .agile-transformation, .learning-and-dev, .advances-cybersecurity, .innovation'
      );
      const layers = Array.from(drawingContainer.querySelectorAll('[class^="layer-"]'));

      // Function to extract the number from the class name of an SVG element
      const extractNumber = (element) => {
        // Accessing className for SVG elements
        const className = element.className.baseVal;
        const match = className.match(/layer-(\d+)/);
        return match ? parseInt(match[1], 10) : null;
      };

      // Grouping the SVG elements by the extracted number
      const groupedLayers = layers.reduce((acc, el) => {
        // Extract number from class name
        const num = extractNumber(el);
        if (num !== null) {
          // Initialize the group array if it doesn't exist
          if (!acc[num]) acc[num] = [];
          // Add the element to the correct group
          acc[num].push(el);
        }
        return acc;
      }, {});

      gsap.set('.additional-text', {
        autoAlpha: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: drawingContainer,
          start: 'top 10%',
        },
        onComplete: () => {
          createEventListeners(groups);
        },
      });

      tl.from(linesAndTexts, {
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.2,
      }).to({}, { duration: 0.05 });

      // Iterate over each group of elements
      Object.keys(groupedLayers).forEach((group, index) => {
        // Animate each group separately
        tl.from(
          groupedLayers[group],
          {
            duration: 0.5,
            autoAlpha: 0, // Example: animate to full opacity
            stagger: 0.05, // Stagger the start time of each element's animation within the group
            delay: 0, // Delay the start of the animation for the current group
          },
          '<0.15'
        );
      });

      // Hover animation
      function animateBubbleOnHover(el) {
        groups.forEach((group) => {
          const additionalText = group.querySelector('.additional-text');
          const title = group.querySelector('.title');
          const groupContainers = group.querySelectorAll('.layer-4-container'); // Select containers instead of individual layers

          if (group !== el) {
            gsap.to(additionalText, { autoAlpha: 0, overwrite: false, duration: 0.25 });

            gsap.to(group, { autoAlpha: 0.4, duration: 0.5 });
            gsap.to(title, { autoAlpha: 0, duration: 0.5 });
            // group.style.pointerEvents = 'none';
          } else {
            // gsap.set(group, { transformOrigin: '50% 50%' });
            gsap.to(group, { scale: 1.2 });
            gsap.to(additionalText, { autoAlpha: 1, duration: 0.35 });

            groupContainers.forEach((container) => {
              const elements = container.querySelectorAll('.layer-4');
              gsap.set(elements, { autoAlpha: 1, transformOrigin: '50% 50%' });

              elements.forEach((element) => {
                const scaleFactor = (element.getBBox().width + 20) / element.getBBox().width;

                gsap.to(elements, {
                  scale: scaleFactor,
                  autoAlpha: 0,
                  duration: 2,
                  stagger: {
                    each: 0.5,
                    repeat: -1,
                  },
                });
              });
            });
          }
        });
      }

      // Create elements for the pulsating effect
      groups.forEach((group) => {
        const lastLayers = group.querySelectorAll('.layer-4');
        const bubble = group.querySelector('.bubble');

        lastLayers.forEach((layer) => {
          // Create a container for the duplicated layers
          const container = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          container.classList.add('layer-4-container'); // Add a class for targeting

          gsap.set(layer, {
            transformOrigin: '50% 50%',
          });

          for (let i = 0; i < 3; i++) {
            const duplicatedLayer = layer.cloneNode();

            duplicatedLayer.style.pointerEvents = 'none';

            container.appendChild(duplicatedLayer); // Append duplicated layers to the container
          }
          bubble.appendChild(container); // Append the container to the group
        });
      });

      // function animateBubbleOnHoverOut(group) {}

      // Add event listeners
      function createEventListeners(groups) {
        groups.forEach((group) => {
          const bubble = group.querySelector('.bubble');
          bubble.addEventListener('mouseenter', () => {
            animateBubbleOnHover(group);
          });

          bubble.addEventListener('mouseleave', () => {
            gsap.to(groups, { autoAlpha: 1, scale: 1, duration: 0.5 });

            const additionalText = group.querySelector('.additional-text');
            if (additionalText) {
              gsap.to(additionalText, { autoAlpha: 0, duration: 0.35 });
            }

            gsap.killTweensOf('.layer-4');
            gsap.set('.layer-4', {
              clearProps: 'scale, autoAlpha',
            });
            gsap.to('.title', { autoAlpha: 1, duration: 0.5 });
          });
        });
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

// Mobile animations
const lastClickedIndex = null;

// function animateBubble(tab, index) {
//   // const bubble = tab.querySelector('.bubble')
//   const tabs = document.querySelectorAll('.tab-pane');
//   const currentTab = tabs[index];
//   console.log(currentTab);
//   const layers = Array.from(currentTab.querySelectorAll('[class^="layer-"]'));

//   if (lastClickedIndex !== index) {
//     gsap.from(layers, {
//       autoAlpha: 0,
//       stagger: 0.1,
//       delay: 0.5,
//     });
//     lastClickedIndex = index;
//   }
// }

function animateBubbleTest() {
  // const bubble = tab.querySelector('.bubble')
  const tabs = document.querySelectorAll('.tab-pane');
  console.log(tabs);

  tabs.forEach((tab, index) => {
    // const currentTab = tab;
    // console.log(currentTab);
    // const layers = Array.from(tab.querySelectorAll('[class^="layer-"]'));

    const additionalText = tab.querySelectorAll('text');
    const center = tab.querySelector('.center');
    const bubble = tab.querySelector('.bubble');
    const svg = tab.querySelector('svg');

    // gsap.set(bubble, {
    //   scale: 2,
    // });

    if (center && bubble) {
      const bubbleBBox = bubble.getBBox();
      const centerBBox = center.getBBox();
      const svgBBox = svg.getBBox();
      // console.log('SVG: ', svgBBox);

      // Calculate scale factors for both dimensions
      const scaleX = window.innerWidth / bubbleBBox.width;
      const scaleY = window.innerHeight / bubbleBBox.height;
      const scale = Math.min(scaleX, scaleY); // Choose the smaller scale factor to ensure the SVG fits entirely

      // Calculate new position to center the bubble
      const distanceX = window.innerWidth / 2 - centerBBox.x;
      const distanceY = window.innerHeight / 2 - centerBBox.y;

      // Set transform origin to the center of the bubble
      const originX = ((centerBBox.x - bubbleBBox.x) / bubbleBBox.width) * 100;
      const originY = ((centerBBox.y - bubbleBBox.y) / bubbleBBox.height) * 100;

      console.log('Distances: ', distanceX, distanceY);
      // console.log('Origin center: ', originX, originY);
      // console.log('Dimensions: ', bubbleBBox.height, bubbleBBox.width);
      // console.log('Bubble bbox', bubbleBBox);
      // console.log('Center bbox', centerBBox);

      // gsap.set(bubble, {
      //   transformOrigin: `${originXPercent}% ${originYPercent}%`,
      // });

      const tl = gsap.timeline({ onComplete: () => gsap.set(bubble, { clearProps: 'all' }) });

      // tl.set(bubble, {
      // transformOrigin: `${originX}% ${originY}%`,

      // scale: 5,
      // });

      const x = centerBBox.x + centerBBox.width / 2 - bubbleBBox.x;
      const y = centerBBox.y + centerBBox.height / 2 - bubbleBBox.y;

      console.log(x, y);

      tl.set(bubble, {
        svgOrigin: `${x} ${y}`,
        x: distanceX,
        y: distanceY,
        scale: 25,
      });

      // tl.to(bubble, {
      //   rotate: 360,
      //   duration: 5,
      //   repeat: -1,
      //   ease: 'none',
      // });

      tl.to(bubble, {
        scale: 1,
        duration: 1.5,
        ease: CustomEase.create(
          'custom',
          'M0,0 C0,0.416 -0.019,0.748 0.104,0.874 0.236,1.006 0.504,1 1,1 '
        ),
      });

      tl.to(
        bubble,
        {
          x: 0,
          y: 0,
          duration: 1,
        },
        '<'
      );
      tl.from(additionalText, {
        autoAlpha: 0,
      });
    }
  });
}

function scrollTo(selector) {
  const elToScrollTo = document.querySelector(selector);
  const elRect = elToScrollTo.getBoundingClientRect();
  const distance = parseInt(elRect.top);
  console.log(distance);

  window.scrollTo({
    top: distance,
    left: 0,
    behavior: 'smooth',
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const mm = gsap.matchMedia();

  const drawingContainer = document.querySelector('.trendradar_component.is-desktop');
  drawingContainer.addEventListener('click', () => {
    scrollTo('#contact');
  });

  mm.add('(min-width: 992px)', () => {
    // desktop setup code here...
    animateDiagramDesktop();
  });

  mm.add('(max-width: 478px)', () => {
    // mobile setup code here...

    const tabLinks = document.querySelectorAll('.tab-link:not(.is-header)');
    tabLinks.forEach((link, index) => {
      link.addEventListener('click', () => {
        animateBubbleTest();
        // animateBubble(link, index);
      });
    });
  });
});
