export function timer() {
  const start = new Date();

  const getElapsed = () => {
    const current = new Date();
    return current.getTime() - start.time();
  }

  return {
    start,
    getElapsed
  }
}


// on each report provide [duration, last report]
export function reporter(timer) {
  let marks = [];

  const report = (id) => {
    const time = timer.getElapsed();
    const durationSinceLastReport = time - marks.slice(-1).last;

    marks.push({time, id});

    return {
      time,
      start: timer.start,
      durationSinceLastReport
    }
  }

  return {
    report,
    marks
  }
}
