import { Edit02Icon, User02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@flcn-lms/ui/components/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle, } from "@flcn-lms/ui/components/card";
function CheckoutUserDetails() {
    return (<Card className="rounded-sm">
      <CardHeader>
        <CardTitle>
          <h3>User Details</h3>
        </CardTitle>
        <CardAction>
          <Button size="icon" variant="ghost">
            <HugeiconsIcon icon={Edit02Icon} size={16}/>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex gap-x-2">
          <HugeiconsIcon icon={User02Icon}/>
          <span>Rishabh</span>
        </div>
      </CardContent>
    </Card>);
}
export default CheckoutUserDetails;
