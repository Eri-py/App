import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import type { BaseSyntheticEvent } from "react";

type HorizontalLinearStepperProps = {
  steps: string[];
  activeStep: number;
  setActiveStep: (value: number) => void;
};

export default function HorizontalLinearStepper({
  steps,
  activeStep,
  setActiveStep,
}: HorizontalLinearStepperProps) {
  const handleClick = (data: BaseSyntheticEvent) => {
    if (Number(data.currentTarget.id) === activeStep) return;
    setActiveStep(Number(data.currentTarget.id));
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, idx) => {
          return (
            <Step key={idx}>
              <StepButton id={`${idx}`} onClick={handleClick} color="primary">
                {label}
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
