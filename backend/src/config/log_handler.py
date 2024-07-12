# in-built
import os
import logging
from datetime import datetime, timedelta


class CustomLogger:
    """
    A custom logger class that sets up logging to both a file and the console.
    Log files are rotated daily and old log files are removed after 15 days.
    """

    def __init__(self) -> None:
        """
        Initialize the CustomLogger instance. Sets up logging to both a file
        and the console with INFO level. Configures the formatter for the logs.
        """
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.DEBUG)

        self.file_handler = self._setup_file_handler()
        self.file_handler.setLevel(logging.INFO)

        self.console_handler = logging.StreamHandler()
        self.console_handler.setLevel(logging.INFO)

        formatter = logging.Formatter(
            "%(asctime)s - %(levelname)s - %(message)s"
        )
        self.file_handler.setFormatter(formatter)
        self.console_handler.setFormatter(formatter)

        self.logger.addHandler(self.file_handler)
        self.logger.addHandler(self.console_handler)

    def _setup_file_handler(self) -> logging.FileHandler:
        """
        Set up the file handler for logging. Creates a directory for
        logs if it doesn't exist and removes old log files (>=15 days).

        Returns:
            logging.FileHandler: The file handler for the current log file.
        """
        logs_dir = "logs"
        os.makedirs(logs_dir, exist_ok=True)

        self.remove_old_log_files(logs_dir)

        current_date = datetime.now().strftime("%d-%m-%Y")
        log_file = os.path.join(logs_dir, f"{current_date}.log")
        return logging.FileHandler(log_file)

    def remove_old_log_files(self, logs_dir: str) -> None:
        """
        Remove log files older than 15 days from
        the specified logs directory.

        Args:
            logs_dir (str):
                The directory containing the log files.
        """
        current_date = datetime.now()
        threshold_date = current_date - timedelta(days=10)

        for file_name in os.listdir(logs_dir):
            file_path = os.path.join(logs_dir, file_name)
            if os.path.isfile(file_path):
                file_date = datetime.strptime(
                    file_name.split(".")[0], "%d-%m-%Y"
                )
                if file_date < threshold_date:
                    os.remove(file_path)

    def log_error(self, log_msg: str) -> logging.Logger:
        """
        Log an error message.

        Args:
            log_msg (str):
                The error message to log.
        """
        self.logger.error(log_msg)

    def log_info(self, log_msg: str) -> logging.Logger:
        """
        Log an informational message.

        Args:
            log_msg (str):
                The informational message to log.
        """
        self.logger.info(log_msg)


logger = CustomLogger()
