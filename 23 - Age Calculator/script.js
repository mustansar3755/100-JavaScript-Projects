
      // --- Helpers ---
      const byId = (id) => document.getElementById(id);

      function isValidDate(d) {
        return d instanceof Date && !isNaN(d);
      }

      function startOfDayUTC(d) {
        return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
      }

      function diffYMD(birth, now) {
        // birth and now are Date objects; birth <= now
        let y = now.getFullYear() - birth.getFullYear();
        let m = now.getMonth() - birth.getMonth();
        let d = now.getDate() - birth.getDate();

        if (d < 0) {
          // borrow days from previous month of 'now'
          const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
          d += prevMonthEnd.getDate();
          m -= 1;
        }
        if (m < 0) {
          m += 12;
          y -= 1;
        }
        return { years: y, months: m, days: d };
      }

      function nextBirthdayFrom(birth, now) {
        let year = now.getFullYear();
        // Try to create next birthday this year
        let nb = new Date(year, birth.getMonth(), birth.getDate());
        // Handle Feb 29 gracefully: if month rolls over, clamp to last day (Feb 28 on non-leap years)
        if (nb.getMonth() !== birth.getMonth()) {
          nb = new Date(year, birth.getMonth() + 1, 0); // last day of target month
        }
        if (
          nb < now ||
          (nb.getFullYear() === now.getFullYear() &&
            nb.getMonth() === now.getMonth() &&
            nb.getDate() === now.getDate())
        ) {
          // If birthday already passed today, or is exactly today (we'll show 0 days left), set to next year only if passed
          if (nb < now) {
            year += 1;
            nb = new Date(year, birth.getMonth(), birth.getDate());
            if (nb.getMonth() !== birth.getMonth()) {
              nb = new Date(year, birth.getMonth() + 1, 0);
            }
          }
        }
        return nb;
      }

      function getZodiac(month, day) {
        // Western zodiac
        const z = [
          ["Capricorn", 1, 19],
          ["Aquarius", 2, 18],
          ["Pisces", 3, 20],
          ["Aries", 4, 19],
          ["Taurus", 5, 20],
          ["Gemini", 6, 20],
          ["Cancer", 7, 22],
          ["Leo", 8, 22],
          ["Virgo", 9, 22],
          ["Libra", 10, 22],
          ["Scorpio", 11, 21],
          ["Sagittarius", 12, 21],
          ["Capricorn", 12, 31],
        ];
        for (let i = 0; i < z.length; i++) {
          const [name, m, d] = z[i];
          const prev = z[(i - 1 + z.length) % z.length];
          const [prevName, pm, pd] = prev;
          const afterPrev = month > pm || (month === pm && day > pd);
          const beforeEqCurr = month < m || (month === m && day <= d);
          if (afterPrev && beforeEqCurr) return name;
        }
        return "—";
      }

      function formatDateLong(d) {
        return d.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      // --- Main ---
      function calculateAge() {
        const dobInput = byId("dob").value;
        const todayInput = byId("today").value;
        const error = byId("error");
        error.textContent = "";

        if (!dobInput) {
          error.textContent = "Please select your date of birth.";
          return;
        }

        const dob = new Date(dobInput + "T00:00:00");
        const now = todayInput
          ? new Date(todayInput + "T00:00:00")
          : new Date();

        if (!isValidDate(dob) || !isValidDate(now)) {
          error.textContent = "Invalid date(s).";
          return;
        }
        // Zero out time for local day precision
        const todayLocal = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        if (dob > todayLocal) {
          error.textContent = "Date of birth cannot be in the future.";
          return;
        }

        // Diff as Y/M/D
        const { years, months, days } = diffYMD(dob, todayLocal);

        // Next birthday & days left (UTC to avoid DST issues)
        const nextBD = nextBirthdayFrom(dob, todayLocal);
        const daysLeft = Math.max(
          0,
          Math.round(
            (startOfDayUTC(nextBD) - startOfDayUTC(todayLocal)) / 86400000
          )
        );

        // Totals
        const totalDays = Math.round(
          (startOfDayUTC(todayLocal) - startOfDayUTC(dob)) / 86400000
        );
        const totalHours = totalDays * 24;

        // Zodiac
        const zodiac = getZodiac(dob.getMonth() + 1, dob.getDate());

        // Render
        byId(
          "ageYMD"
        ).textContent = `${years} years • ${months} months • ${days} days`;
        byId("nextBirthday").textContent = `${formatDateLong(nextBD)}`;
        byId("daysLeft").textContent = `${daysLeft} day${
          daysLeft === 1 ? "" : "s"
        }`;
        byId("totalDays").textContent = `${totalDays.toLocaleString()} days`;
        byId("totalHours").textContent = `${totalHours.toLocaleString()} hours`;
        byId("zodiac").textContent = zodiac;

        byId("results").style.display = "grid";
      }

      function resetAll() {
        byId("ageForm").reset();
        byId("results").style.display = "none";
        byId("error").textContent = "";
      }

      // Set max attribute so users can't pick future DOB
      (function setMaxDates() {
        const today = new Date();
        const iso = today.toISOString().slice(0, 10);
        byId("dob").setAttribute("max", iso);
        byId("today").setAttribute("max", iso);
        byId("today").setAttribute("placeholder", "Today (optional)");
      })();