function generate6DigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default generate6DigitCode;
