
import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
  color?: "primary" | "accent" | "destructive"
}

export function MetricCard({ title, value, icon: Icon, trend, color = "primary" }: MetricCardProps) {
  const colorClasses = {
    primary: "border-l-primary bg-primary/5",
    accent: "border-l-accent bg-accent/5", 
    destructive: "border-l-destructive bg-destructive/5"
  }

  return (
    <Card className={`metric-card ${colorClasses[color]}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trend && (
              <p className={`text-sm mt-1 ${trend.isPositive ? 'text-accent' : 'text-destructive'}`}>
                {trend.isPositive ? '↗' : '↘'} {trend.value}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color === 'primary' ? 'bg-primary/10' : color === 'accent' ? 'bg-accent/10' : 'bg-destructive/10'}`}>
            <Icon className={`w-6 h-6 ${color === 'primary' ? 'text-primary' : color === 'accent' ? 'text-accent' : 'text-destructive'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
