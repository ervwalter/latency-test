import { useEffect, useState } from "react";

interface Stat {
	test: string;
	time: number;
	count: number;
}

const get = async (url: string) => {
	return (await fetch(url)).text();
};

export const Home = () => {
	const [stats, setStats] = useState<Stat[]>([]);
	const [iteration, setIteration] = useState(0);

	useEffect(() => {
		const updateResult = (test: string, start: number, end: number) => {
			setStats((prevStats) => {
				const match = prevStats.find((s) => s.test === test);
				if (match) {
					return prevStats.map((stat) => {
						if (stat !== match) {
							return stat;
						}

						return {
							...stat,
							time: stat.time + (end - start) / 1000,
							count: stat.count + 1,
						};
					});
				} else {
					return [
						...prevStats,
						{
							test,
							time: (end - start) / 1000,
							count: 1,
						},
					];
				}
			});
		};

		const runTest = async (
			test: string,
			url: string,
			times: number = 1
		) => {
			const start = performance.now();
			for (let i = 0; i < times; i++) {
				await get(url);
			}
			updateResult(test, start, performance.now());
		};

		const workUrl = (delay: number, size: number) => {
			return `/api/work?delay=${delay}&size=${size}`;
		};

		const reset = async () => {
			await get("/api/work?delay=0&size=10");
		};

		const runTests = async () => {
			for (let count = 0; count < 30; count++) {
				setIteration((prev) => prev + 1);
				await reset();
				await runTest("Empty Request", "/api/work/ping");
				await reset();
				await runTest("100k data", workUrl(200, 100 * 1024));
				await reset();
				await runTest("500k data", workUrl(200, 500 * 1024));
				await reset();
				await runTest("1MB data", workUrl(200, 1 * 1024 * 1024));
				await reset();
				await runTest("2MB data", workUrl(200, 2 * 1024 * 1024));
				await reset();
				await runTest("3MB data", workUrl(200, 3 * 1024 * 1024));
				await reset();
				await runTest("4MB data", workUrl(200, 4 * 1024 * 1024));
				await reset();
				await runTest("5MB data", workUrl(200, 5 * 1024 * 1024));
				await reset();
				await runTest("10MB data", workUrl(200, 10 * 1024 * 1024));
				await reset();
				await runTest(
					"2MB data, 1s of simulated work in a single request",
					workUrl(1000, 10 * 200 * 1024),
					1
				);
				await reset();
				await runTest(
					"2MB data, 1s of simulated work across 5 requests",
					workUrl(200, 2 * 200 * 1024),
					5
				);
				await reset();
				await runTest(
					"2MB data, 1s of simulated work across 10 requests",
					workUrl(100, 1 * 200 * 1024),
					10
				);
			}
		};

		runTests();
	}, []);

	return (
		<>
			<h1>{window.location.hostname.split(".")[0]}</h1>
			<p>
				<b>Iterations: {iteration}</b>
			</p>
			<table className="table" style={{ width: "auto" }}>
				<thead>
					<tr>
						<th scope="col">Test</th>
						<th scope="col">Time</th>
					</tr>
				</thead>
				<tbody>
					{stats.map((stat) => (
						<tr key={stat.test}>
							<td>{stat.test}</td>
							<td>{(stat.time / stat.count).toFixed(3)}s</td>
						</tr>
					))}

					{/* {running && (
						<tr key={running}>
							<td>{running}</td>
							<td>...</td>
						</tr>
					)} */}
				</tbody>
			</table>
		</>
	);
};
