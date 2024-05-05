import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Index from "../pages/Index";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

const setRecognition = jest.fn();
const startRecording = jest.fn();
const stopRecording = jest.fn();
const pauseRecording = jest.fn();
const resumeRecording = jest.fn();
const detectKeywords = jest.fn();

describe("Voice Component Tests", () => {
  beforeEach(() => {
    React.useState.mockImplementation((init) => [init, jest.fn()]);
  });

  test('handleVoiceCommand triggers startRecording on "start"', () => {
    const { getByText } = render(<Index />);
    fireEvent.click(getByText("Start Recording"));
    expect(startRecording).toHaveBeenCalled();
  });

  test('handleVoiceCommand triggers stopRecording on "stop"', () => {
    const { getByText } = render(<Index />);
    fireEvent.click(getByText("Stop Recording"));
    expect(stopRecording).toHaveBeenCalled();
  });

  test('handleVoiceCommand triggers pauseRecording on "pause"', () => {
    const { getByText } = render(<Index />);
    fireEvent.click(getByText("Pause"));
    expect(pauseRecording).toHaveBeenCalled();
  });

  test('handleVoiceCommand triggers resumeRecording on "resume"', () => {
    const { getByText } = render(<Index />);
    fireEvent.click(getByText("Resume"));
    expect(resumeRecording).toHaveBeenCalled();
  });

  test("handleVoiceCommand triggers detectKeywords on unrecognized command", () => {
    const command = "pet";
    const { getByText } = render(<Index />);
    fireEvent.click(getByText("Add PET"));
    expect(detectKeywords).toHaveBeenCalledWith(command);
  });
});
