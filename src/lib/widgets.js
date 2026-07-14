import TasksWidget from "../components/widgets/TasksWidget";
import CashFlowWidget from "../components/widgets/CashFlowWidget";
import InvoicesWidget from "../components/widgets/InvoicesWidget";
import InventoryWidget from "../components/widgets/InventoryWidget";
import NewsWidget from "../components/widgets/NewsWidget";
import MarketsWidget from "../components/widgets/MarketsWidget";
import CalendarWidget from "../components/widgets/CalendarWidget";
import BettingWidget from "../components/widgets/BettingWidget";
import CryptoWidget from "../components/widgets/CryptoWidget";

export const WIDGETS = [
  { id:"tasks",    label:"Today's Tasks",      Component:TasksWidget    },
  { id:"cashflow", label:"Cash Flow",           Component:CashFlowWidget },
  { id:"invoices", label:"Invoices",            Component:InvoicesWidget },
  { id:"inventory",label:"Inventory",           Component:InventoryWidget },
  { id:"news",     label:"Business News",       Component:NewsWidget     },
  { id:"markets",  label:"Markets",             Component:MarketsWidget  },
  { id:"calendar", label:"Economic Calendar",   Component:CalendarWidget },
  { id:"betting",  label:"Soccer Betting",      Component:BettingWidget  },
  { id:"crypto",   label:"Cryptocurrency",      Component:CryptoWidget   },
];

export const DEFAULT_LAYOUT = WIDGETS.map(w => w.id);
