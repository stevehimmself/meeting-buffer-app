function addBufferTimeAndCleanup() {
  // The number of months into the future to process events
  const MONTHS_AHEAD = 3;
  // The length of buffer time after meetings (in minutes)
  const BUFFER_LENGTH = 15;

  var calendar = CalendarApp.getDefaultCalendar();
  var now = new Date();
  
  // Process events from now until configured months from now
  var endTime = new Date(now);
  endTime.setMonth(endTime.getMonth() + MONTHS_AHEAD);
  
  // ----- PART 1: Create Meeting Buffer events -----
  var events = calendar.getEvents(now, endTime);
  
  events.forEach(function(event) {
    Logger.log("Processing event: " + event.getTitle());
    
    // Skip all-day events
    if (event.isAllDayEvent()) {
      Logger.log("Skipping all-day event: " + event.getTitle());
      return;
    }
    
    // Skip events without guests
    if (event.getGuestList().length === 0) {
      Logger.log("Skipping event with no guests: " + event.getTitle());
      return;
    }
    
    // Check RSVP status (only add a buffer if accepted or if you're the organizer)
    var myStatus = event.getMyStatus();
    Logger.log("My status for event '" + event.getTitle() + "': " + myStatus);
    if (myStatus !== CalendarApp.GuestStatus.YES && myStatus !== CalendarApp.GuestStatus.OWNER) {
      Logger.log("Skipping event (not accepted): " + event.getTitle());
      return;
    }
    
    // Skip events that are already Meeting Buffers
    if (event.getTitle().startsWith("Meeting Buffer")) {
      Logger.log("Skipping event (already a buffer): " + event.getTitle());
      return;
    }
    
    // Define the buffer period
    var bufferStart = event.getEndTime();
    var bufferEnd = new Date(bufferStart.getTime() + BUFFER_LENGTH * 60 * 1000);
    
    // Check if a Meeting Buffer already exists in that time window
    var overlapping = calendar.getEvents(bufferStart, bufferEnd)
      .some(function(ev) {
        return ev.getTitle().startsWith("Meeting Buffer");
      });
    if (overlapping) {
      Logger.log("Skipping event (buffer already exists) for: " + event.getTitle());
      return;
    }
    
    // Create the Meeting Buffer event
    var bufferEvent = calendar.createEvent("Meeting Buffer", bufferStart, bufferEnd, {
      description: "Auto-blocked time after meeting",
      visibility: CalendarApp.Visibility.PRIVATE
    });
    
    // Set its color to Gray
    bufferEvent.setColor(CalendarApp.EventColor.GRAY);
    Logger.log("Buffer created after event: " + event.getTitle());
  });
  
  // ----- PART 2: Cleanup Orphaned Meeting Buffer events -----
  // Get all events again (assumed to be sorted by start time)
  var allEvents = calendar.getEvents(now, endTime);
  var tolerance = 5 * 60 * 1000; // 5 minutes tolerance
  
  // Iterate through all events in order
  for (var i = 0; i < allEvents.length; i++) {
    var ev = allEvents[i];
    if (ev.getTitle().startsWith("Meeting Buffer")) {
      // Look backward to find the most recent non-buffer event
      var previousNonBuffer = null;
      for (var j = i - 1; j >= 0; j--) {
        var candidate = allEvents[j];
        if (!candidate.getTitle().startsWith("Meeting Buffer")) {
          previousNonBuffer = candidate;
          break;
        }
      }
      
      // If no previous non-buffer event is found, or if the gap is too large, delete this buffer.
      if (!previousNonBuffer) {
        ev.deleteEvent();
        Logger.log("Deleted orphan Meeting Buffer at " + ev.getStartTime() + " (no preceding event).");
      } else {
        var gap = Math.abs(ev.getStartTime().getTime() - previousNonBuffer.getEndTime().getTime());
        if (gap > tolerance) {
          ev.deleteEvent();
          Logger.log("Deleted orphan Meeting Buffer at " + ev.getStartTime() +
                     ". Preceding event ended at " + previousNonBuffer.getEndTime() +
                     " (gap: " + gap/60000 + " minutes).");
        }
      }
    }
  }
  
  Logger.log("Execution completed.");
}
