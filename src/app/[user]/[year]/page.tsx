import { Params } from "./params.model";

export default async function Contributions({
  params: { user = "lashagelashvili", year = "2023" },
}: Params) {
  const res = await fetch(`http://localhost:3000/api/${user}/${year}`);

  let data = await res.json();

  let total = 0;

  data.forEach((row: any) => {
    row.forEach((day: any) => {
      if (day) {
        total += day.count;
      }
    });
  });

  return (
    <>
      <h2>
        {total} contributions in {year}
      </h2>

      <table>
        {data.map((row: any, rowIndex: number) => (
          <tbody key={rowIndex}>
            <tr key={rowIndex}>
              {row.map((day: any, dayIndex: number) => (
                <td key={dayIndex} data-level={day?.level}></td>
              ))}
            </tr>
          </tbody>
        ))}
      </table>
    </>
  );
}
