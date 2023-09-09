import { parseHTML } from "linkedom";
import { NextResponse } from "next/server";
import { Params } from "../../../../app/[user]/[year]/params.model";

export async function GET(
  request: Request,
  { params: { user, year } }: Params
) {
  if (!user || !year) {
    user = "lashagelashvili";
    year = "2023";
  }

  const res = await getContributions(user, year);

  return NextResponse.json(parseContributions(res));
}

async function getContributions(user: string, year: string) {
  const api = `https://github.com/users/${user}/contributions?from=${year}-12-01&to=${year}-12-31`;

  const res = await fetch(api);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return await res.text();
}

function parseContributions(html: string) {
  const { document } = parseHTML(html);

  const rows = document.querySelectorAll<HTMLTableRowElement>("tbody > tr");

  const contributions = [];

  for (const row of rows) {
    const days = row.querySelectorAll<HTMLTableCellElement>(
      "td:not(.ContributionCalendar-label)"
    );

    const currentRow: any[] = [];

    for (const day of days) {
      const data = day.innerText.split(" ");

      if (data.length > 1) {
        const contribution = {
          count: data[0] === "No" ? 0 : +data[0],
          name: data[3].replace(",", ""),
          month: data[4],
          day: +data[5].replace(",", ""),
          year: +data[6],
          level: +day.dataset.level!,
        };
        currentRow.push(contribution);
      } else {
        currentRow.push(null);
      }
    }

    contributions.push(currentRow);
  }

  return contributions;
}
