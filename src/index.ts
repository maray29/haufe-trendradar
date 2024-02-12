import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

function animateDiagramDesktop() {
  const drawingContainer = document.querySelector('.haufe-trendradar.is-desktop');
  // Fetch the svg from github and append to the embed div
  const diagram =
    'https://gist.githubusercontent.com/maray29/e78f6255dd37f1651ac6ddd97cebba1b/raw/3a0cd84e44bc3d5550256948a2c68f468f6d2f66/haufe-trendradar.html';

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
            gsap.set(group, { transformOrigin: '50% 50%' });
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
let lastClickedIndex = null;

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

    const center = tab.querySelector('.center');
    const bubble = tab.querySelector('.bubble');

    // gsap.set(bubble, {
    //   scale: 2,
    // });

    if (center) {
      console.log('Center: ', center);

      const bubbleBBox = bubble.getBBox();
      const centerBBox = center.getBBox();

      const distanceX = document.documentElement.clientWidth / 2 - centerBBox.x;
      const distanceY = document.documentElement.clientHeight / 2 - centerBBox.y;

      // Calculate center's position relative to bubble
      const relativeX = centerBBox.x + centerBBox.width / 2;
      const relativeY = centerBBox.y + centerBBox.height / 2 - bubbleBBox.y;

      // Convert to percentage for transformOrigin
      const originXPercent = (relativeX / window.innerWidth) * 100;
      const originYPercent = (relativeY / window.innerHeight) * 100;

      gsap.set(bubble, {
        transformOrigin: `${originXPercent}% ${originYPercent}%`,
      });

      gsap.set(bubble, {
        x: distanceX,
        y: distanceY,
        scale: 25,
      });

      gsap.to(bubble, {
        scale: 1,
        duration: 1.5,
        ease: CustomEase.create(
          'custom',
          'M0,0 C0,0.416 -0.019,0.748 0.104,0.874 0.236,1.006 0.504,1 1,1 '
        ),
      });

      gsap.to(bubble, {
        x: 0,
        y: 0,
        duration: 1,
      });
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const mm = gsap.matchMedia();

  mm.add('(min-width: 992px)', () => {
    // desktop setup code here...
    animateDiagramDesktop();
  });

  mm.add('(max-width: 478px)', () => {
    // mobile setup code here...

    animateBubbleTest();

    const tabLinks = document.querySelectorAll('.tab-link');
    // tabLinks.forEach((link, index) => {
    //   link.addEventListener('click', () => {
    //     animateBubble(link, index);
    //   });
    // });
  });
});
