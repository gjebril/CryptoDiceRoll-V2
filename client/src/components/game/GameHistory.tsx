import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface GameHistoryProps {
  userId: number;
}

export default function GameHistory({ userId }: GameHistoryProps) {
  const { data: games } = useQuery({
    queryKey: [`/api/games/${userId}`],
  });

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Game History</h3>
      <ScrollArea className="h-[200px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bet Amount</TableHead>
              <TableHead>Multiplier</TableHead>
              <TableHead>Roll</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Payout</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games?.map((game: any) => (
              <TableRow key={game.id}>
                <TableCell>{parseFloat(game.betAmount).toFixed(8)} BTC</TableCell>
                <TableCell>{parseFloat(game.multiplier).toFixed(4)}x</TableCell>
                <TableCell>{parseFloat(game.roll).toFixed(2)}</TableCell>
                <TableCell>{game.targetValue}</TableCell>
                <TableCell className={game.won ? "text-green-500" : "text-red-500"}>
                  {game.won ? "Win" : "Loss"}
                </TableCell>
                <TableCell>{parseFloat(game.payout).toFixed(8)} BTC</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
