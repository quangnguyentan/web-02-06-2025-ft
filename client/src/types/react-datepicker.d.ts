declare module "react-datepicker" {
  export interface YearProps {
    onYearMouseEnter?: () => void;
    onYearMouseLeave?: () => void;
  }
  export interface MonthProps {
    ariaLabelPrefix?: string;
    handleOnKeyDown?: (e: React.KeyboardEvent) => void;
  }
  export interface TimeProps {
    onChange?: (date: Date) => void;
    format?: string;
    intervals?: number;
  }
  // Add other missing properties as needed
}
