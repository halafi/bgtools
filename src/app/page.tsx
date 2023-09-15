"use client";

import Image from "next/image";
import { useSpring, animated } from "@react-spring/web";
import { useEffect, useState } from "react";

function rollSixSidedDie() {
  return Math.floor(Math.random() * 6) + 1;
}

export default function Home() {
  const [result, setResult] = useState("");
  const [rollsHistory, setRollsHistory] = useState<string[]>([]);
  const [hideHistory, setHideHistory] = useState(false);
  // State to keep track of the animation toggle
  const [state, toggle] = useState(true);
  // Define the animation using the useSpring hook
  const { x } = useSpring({
    from: { x: 0 }, // Starting value of the animated property
    x: state ? 1 : 0, // Ending value of the animated property based on the state
    config: { duration: 1000 }, // Configuration for the animation, specifying the duration
  });

  useEffect(() => {
    // Load rolls history from localStorage when the component mounts
    const storedHistory = localStorage.getItem("rollsHistory");
    if (storedHistory) {
      setRollsHistory(JSON.parse(storedHistory));
    }
  }, []);

  const rollSixSidedDice = () => {
    toggle(false);
    setTimeout(() => {
      toggle(true);
    }, 1000);
    const randomNumber = rollSixSidedDie();
    const result = `D6: ${randomNumber}`;
    setResult(result);
    updateHistory(result);
  };

  const updateHistory = (result: string | null) => {
    if (result === null) {
      setRollsHistory([]);
      localStorage.setItem("rollsHistory", JSON.stringify([]));
    } else {
      // Update rolls history in localStorage
      const updatedHistory = [...rollsHistory, result];
      setRollsHistory(updatedHistory);
      localStorage.setItem("rollsHistory", JSON.stringify(updatedHistory));
    }
  };

  const handleRollClick = () => {
    toggle(false);
    setTimeout(() => {
      toggle(true);
    }, 1000);
    let rolls = [];
    let total = 0;

    do {
      const rollResult = rollSixSidedDie();
      rolls.push(rollResult);
      total += rollResult;
    } while (rolls[rolls.length - 1] === 6);

    const resultString = `D6+: ${rolls.join("+")} = ${total}`;
    setResult(resultString);
    updateHistory(resultString);
  };

  function rollDnDPercentage() {
    toggle(false);
    setTimeout(() => {
      toggle(true);
    }, 1000);
    const die1 = Math.floor(Math.random() * 10);
    const die2 = Math.floor(Math.random() * 10);
    const percentage = die1 * 10 + die2;
    const result = percentage === 0 ? 100 : percentage;
    setResult(`D%: ${result}%`);
    updateHistory(`D%: ${result}%`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="flex flex-col items-center mt-16">
        <div className="font-bold text-5xl h-16 transition ease-in-out delay-150 my-8 box-content">
          <animated.div
            style={{
              opacity: x.to({ range: [0, 1], output: [0.3, 1] }),
              transform: x
                .to({
                  range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
                  output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1],
                })
                .to((x) => `scale(${x})`),
            }}
          >
            {result.split(":")[1]}
          </animated.div>
        </div>

        {rollsHistory.length > 0 && !hideHistory && (
          <div className="w-72 my-16">
            <h2>Past throws</h2>
            <ul className="max-h-32 overflow-y-auto text-sm text-gray-500">
              {rollsHistory.reverse().map((roll, index) => (
                <li key={index}>{roll}</li>
              ))}
            </ul>
            <div className="flex space-x-2 mt-2">
              <div
                className="text-white font-bold cursor-pointer"
                onClick={() => updateHistory(null)}
              >
                clear
              </div>
              <div
                className="text-white font-bold cursor-pointer"
                onClick={() => setHideHistory(true)}
              >
                hide
              </div>
            </div>
          </div>
        )}
        <div className="mb-16 grid text-center">
          <div
            onClick={rollDnDPercentage}
            className="select-none cursor-pointer group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className="flex mb-3 text-2xl font-semibold">
              D%{" "}
              <div className="ml-2 flex transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                <Image
                  src="/10_sided_die.svg"
                  alt="10 sided die"
                  width={28}
                  height={28}
                />
                <Image
                  src="/10_sided_die.svg"
                  alt="10 sided die"
                  width={28}
                  height={28}
                />
              </div>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Percentage dice roll.
            </p>
          </div>

          <div
            onClick={rollSixSidedDice}
            className="select-none cursor-pointer group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className={`flex mb-3 text-2xl font-semibold`}>
              D6{" "}
              <div className="ml-2 flex transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                🎲
              </div>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Single D6 roll.
            </p>
          </div>

          <div
            onClick={handleRollClick}
            className="select-none cursor-pointer group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className={`flex mb-3 text-2xl font-semibold`}>
              D6+{" "}
              <div className="ml-2 flex transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                🎲❓🎲
              </div>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              D6+ roll, subsequent throw of 6 adds up.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
