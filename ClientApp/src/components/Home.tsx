import React, { Component, useEffect, useState } from "react";

interface Stat {
	test: string;
	time: number;
}

const get = async (url: string) => {
	return (await fetch(url)).text();
};

export const Home = () => {
	const [stats, setStats] = useState<Stat[]>([]);
	const [running, setRunning] = useState("");

	useEffect(() => {
		const addResult = (test: string, start: number, end: number) => {
			setStats((prevStats) => [
				...prevStats,
				{ test, time: (end - start) / 1000 },
			]);
		};

		const runTest = async (
			test: string,
			url: string,
			times: number = 1
		) => {
			setRunning(test);
			const start = performance.now();
			for (let i = 0; i < times; i++) {
				await get(url);
			}
			addResult(test, start, performance.now());
		};

		const workUrl = (delay: number, size: number) => {
			return `/api/work?delay=${delay}&size=${size}`;
		};

		const runTests = async () => {
			await runTest("Empty Ping Request", "/api/work/ping");
			await runTest("100k data", workUrl(200, 100 * 1024));
			await runTest("500k data", workUrl(200, 500 * 1024));
			await runTest("1MB data", workUrl(200, 1 * 1024 * 1024));
			await runTest("2MB data", workUrl(200, 2 * 1024 * 1024));
			await runTest("3MB data", workUrl(200, 3 * 1024 * 1024));
			await runTest("4MB data", workUrl(200, 4 * 1024 * 1024));
			await runTest("5MB data", workUrl(200, 5 * 1024 * 1024));
			await runTest("10MB data", workUrl(200, 10 * 1024 * 1024));
			await runTest("50MB data", workUrl(200, 50 * 1024 * 1024));
			await runTest("100MB data", workUrl(200, 100 * 1024 * 1024));
			await runTest(
				"5MB data, 1s of simulated work in a single request",
				workUrl(1000, 5000 * 1024),
				1
			);
			await runTest(
				"5MB data, 1s of simulated work across 5 requests",
				workUrl(200, 1000 * 1024),
				5
			);
			await runTest(
				"5MB data, 1s of simulated work across 10 requests",
				workUrl(100, 500 * 1024),
				10
			);

			setRunning("");
		};

		runTests();
	}, []);

	return (
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
						<td>{stat.time.toFixed(3)}s</td>
					</tr>
				))}

				{running && (
					<tr key={running}>
						<td>{running}</td>
						<td>...</td>
					</tr>
				)}
			</tbody>
		</table>
	);
};
