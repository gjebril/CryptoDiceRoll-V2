import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { verifyBet } from "@/lib/provablyFair";
import { useToast } from "@/hooks/use-toast";

interface ProvablyFairProps {
  clientSeed: string;
  serverSeedHash: string | null;
  lastServerSeed: string | null;
  targetValue: number;
  isOver: boolean;
}

export default function ProvablyFair({
  clientSeed,
  serverSeedHash,
  lastServerSeed,
  targetValue,
  isOver,
}: ProvablyFairProps) {
  const [verifyClientSeed, setVerifyClientSeed] = useState("");
  const [verifyServerSeed, setVerifyServerSeed] = useState("");
  const [verificationResult, setVerificationResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!verifyClientSeed || !verifyServerSeed) {
      toast({
        title: "Error",
        description: "Please enter both client seed and server seed",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await verifyBet(
        verifyClientSeed,
        verifyServerSeed,
        targetValue,
        isOver
      );

      if (result.verified) {
        setVerificationResult(
          `Roll: ${result.roll.toFixed(2)} - ${result.won ? "Win" : "Loss"}`
        );
        toast({
          title: "Verification Successful",
          description: `Roll verified: ${result.roll.toFixed(2)}`,
        });
      } else {
        setVerificationResult("Verification failed - invalid seeds");
        toast({
          title: "Verification Failed",
          description: "Could not verify the bet with provided seeds",
          variant: "destructive",
        });
      }
    } catch (error) {
      setVerificationResult("Error verifying result");
      toast({
        title: "Verification Error",
        description: "An error occurred during verification",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span className="text-xs">Provably Fair</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Provably Fair</DialogTitle>
            <DialogClose>
              <X className="h-4 w-4" />
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Current Client Seed</Label>
            <Input 
              value={clientSeed} 
              readOnly 
              className="font-mono bg-muted"
            />
          </div>

          <div>
            <Label>Server Seed Hash</Label>
            <Input 
              value={serverSeedHash || ''} 
              readOnly 
              className="font-mono bg-muted"
            />
          </div>

          {lastServerSeed && (
            <div>
              <Label>Last Server Seed (Revealed)</Label>
              <Input 
                value={lastServerSeed} 
                readOnly 
                className="font-mono bg-muted"
              />
            </div>
          )}

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-4">Verify Previous Roll</h4>

            <div className="space-y-4">
              <div>
                <Label>Client Seed</Label>
                <Input
                  value={verifyClientSeed}
                  onChange={(e) => setVerifyClientSeed(e.target.value)}
                  className="font-mono"
                  placeholder="Enter client seed to verify"
                />
              </div>

              <div>
                <Label>Server Seed</Label>
                <Input
                  value={verifyServerSeed}
                  onChange={(e) => setVerifyServerSeed(e.target.value)}
                  className="font-mono"
                  placeholder="Enter revealed server seed"
                />
              </div>

              <Button onClick={handleVerify} className="w-full">
                Verify Roll
              </Button>

              {verificationResult && (
                <div className="p-4 bg-muted rounded-lg mt-4 text-center font-mono">
                  {verificationResult}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}