import { FaExclamationTriangle } from 'react-icons/fa';

interface ErrorMessageProps {
    title?: string;
    message: string;
    className?: string;
}

const ErrorMessage = ({ title = 'エラーが発生しました', message, className = '' }: ErrorMessageProps) => {
    return (
        <div
        className={`p-4 md:p-6 rounded-lg border shadow-md bg-red-50 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-500/50 dark:text-red-400 ${className}`}
        role="alert"
        >
        <div className="flex items-start">
            <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-red-500 dark:text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
            <h3 className="text-sm md:text-base font-semibold">
                {title}
            </h3>
            <div className="mt-1 text-xs md:text-sm">
                <p>{message}</p>
            </div>
            </div>
        </div>
        </div>
    );
};

export default ErrorMessage;