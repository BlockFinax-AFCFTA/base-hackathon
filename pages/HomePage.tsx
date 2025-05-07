import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Welcome to BlockFinaX</CardTitle>
          <CardDescription>
            Blockchain-powered international trade platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-lg mb-2">Welcome, {user?.username}!</h3>
              <p className="text-muted-foreground">
                You are now authenticated in the system. You can access protected resources and features.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Manage your stablecoin wallet and transactions</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => window.location.href = "/wallet"}>
                    Open Wallet
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Contracts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">View and manage your trade contracts</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => window.location.href = "/contracts"}>
                    View Contracts
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Manage your trade documents and verifications</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => window.location.href = "/documents"}>
                    View Documents
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Translator</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Translate and manage international documents</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => window.location.href = "/document-translator"}>
                    Open Translator
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="secondary" 
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}