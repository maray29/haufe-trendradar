import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function animateDiagramDesktop() {
  const drawingContainer = document.querySelector('.haufe-trendradar');
  // Fetch the svg from github and append to the embed div
  const diagram =
    'https://gist.githubusercontent.com/maray29/e78f6255dd37f1651ac6ddd97cebba1b/raw/739bf12e12c3437274022d3b273413db705027f0/haufe-trendradar.html';

  fetch(diagram)
    .then((response) => response.text())
    .then((data) => {
      // const terrainLines = document.querySelector(".terrain-lines");
      drawingContainer.insertAdjacentHTML('beforeend', data);
    })
    .then((data) => {
      const elements = document.querySelector('.haufe-trendradar');
      const lines = document.querySelector('.lines');
      const learningAndDev = document.querySelector('.learning-and-dev');
      const agileTransformation = document.querySelector('.agile-transformation');

      // Starting point: selection of elements
      const layers = Array.from(document.querySelectorAll('[class^="layer-"]'));

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

      console.log(groupedLayers);

      gsap.set('.additional-text', {
        autoAlpha: 0,
      });

      const linesAndTexts = gsap.utils.toArray(['.group-1', '.group-2', '.group-3', '.group-4']);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: drawingContainer,
          start: 'top top',
        },
      });

      tl.from(linesAndTexts, {
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.2,
      }).to({}, { duration: 0.05 });

      // tl.from(['.group-1'], {
      //   autoAlpha: 0,
      // })
      //   .from(['.group-2'], {
      //     autoAlpha: 0,
      //   })
      //   .from(['.group-3'], {
      //     autoAlpha: 0,
      //   })
      //   .from(['.group-4'], {
      //     autoAlpha: 0,
      //   });

      // Duration of the animation for each element
      const duration = 1; // 1 second for demonstration

      // Delay between each group's animation
      const groupDelay = 0.05; // Half a second delay

      // Iterate over each group of elements
      Object.keys(groupedLayers).forEach((group, index) => {
        // Calculate the delay for the current group based on its index
        const delay = index * groupDelay;

        // Animate each group separately
        tl.from(
          groupedLayers[group],
          {
            duration: 0.5,
            autoAlpha: 0, // Example: animate to full opacity
            stagger: 0.01, // Stagger the start time of each element's animation within the group
            delay: 0, // Delay the start of the animation for the current group
          },
          '<0.15'
        );
      });
      // tl.from(
      //   [
      //     '.learning-and-dev-text',
      //     '.agile-transformation-text',
      //     '.ai-strategy-text',
      //     '.digital-transformation-text',
      //     '.data-intelligence-text',
      //     '.advances-cybersecurity-text',
      //     '.innovation-text',
      //     '.sustainability-management-text',
      //     '.global-talent-text',
      //     '.people-culture-text',
      //   ],
      //   {
      //     autoAlpha: 0,
      //     stagger: 0.1,
      //   },
      //   '<0.15'
      // );

      // Hover animation

      const groups = gsap.utils.toArray([
        '.global-talent',
        '.sustainability-management',
        '.people-culture',
        '.digital-transformation',
        '.data-intelligence',
        '.ai-strategy',
        '.agile-transformation',
        '.learning-and-dev',
        '.advances-cybersecurity',
        '.innovation',
      ]);

      // const bubbles = gsap.utils.toArray(['.bubble']);

      const layersToAnimate = [];

      function animateBubbleOnHover(el) {
        groups.forEach((group) => {
          const additionalText = group.querySelector('.additional-text');
          const groupContainers = group.querySelectorAll('.layer-4-container'); // Select containers instead of individual layers

          if (group !== el) {
            gsap.to(group, { autoAlpha: 0.4, duration: 0.5 });
            // group.style.pointerEvents = 'none';
          } else {
            gsap.set(group, { transformOrigin: '50% 50%' });
            gsap.to(group, { scale: 1.2 });
            gsap.to(additionalText, { autoAlpha: 1, duration: 0.5, delay: 0.25 });

            groupContainers.forEach((container) => {
              const elements = container.querySelectorAll('.layer-4');
              console.log(elements);
              gsap.set(elements, { autoAlpha: 1, transformOrigin: '50% 50%' });

              gsap.to(elements, {
                scale: 1.5,
                autoAlpha: 0,
                duration: 2,
                stagger: {
                  each: 0.5,
                  repeat: -1,
                },
              });
            });
          }
        });
      }
      groups.forEach((group) => {
        const lastLayers = group.querySelectorAll('.layer-4');
        const bubble = group.querySelector('.bubble');

        lastLayers.forEach((layer, index) => {
          // Create a container for the duplicated layers
          const container = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          container.classList.add('layer-4-container'); // Add a class for targeting

          // gsap.set(container, {
          //   transformOrigin: '50% 50%',
          // });

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

        bubble.addEventListener('mouseenter', () => {
          animateBubbleOnHover(group);
        });
        bubble.addEventListener('mouseleave', () => {
          gsap.to(groups, { autoAlpha: 1, scale: 1, duration: 0.5 }); // Reset all bubbles to full opacity
          gsap.to('.additional-text', { autoAlpha: 0, duration: 0.5 });
          gsap.killTweensOf('.layer-4');
          gsap.set('.layer-4', {
            clearProps: 'scale, autoAlpha',
          });
        });
      });
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

window.addEventListener('DOMContentLoaded', () => {
  animateDiagramDesktop();
});
