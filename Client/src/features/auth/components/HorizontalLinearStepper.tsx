import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

type HorizontalLinearStepperProps = {
  steps: string[];
  activeStep: number;
  setActiveStep: (value: number) => void;
};

export function HorizontalLinearStepper({ steps, activeStep }: HorizontalLinearStepperProps) {
  return (
    <Box>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, idx) => {
          return (
            <Step key={idx}>
              <StepLabel id={`${idx}`} color="primary">
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
