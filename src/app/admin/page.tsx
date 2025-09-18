import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "./_components/DashboardLayout";

export default function AdminDashboardPage() {
  return (
    
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent>120</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Outlets</CardTitle>
          </CardHeader>
          <CardContent>15</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>34</CardContent>
        </Card>
      </div>
    
  );
}
