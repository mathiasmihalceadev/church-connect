"use client"

import * as React from "react"
import {Clock as ClockIcon} from "@phosphor-icons/react"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui-time-picker/button"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui-time-picker/select"

const TimePicker = React.forwardRef((props, ref) => {
    const [hour, setHour] = React.useState(null)
    const [minute, setMinute] = React.useState(null)
    const [period, setPeriod] = React.useState(null)

    const handleHourChange = (value) => {
        setHour(value)
        props.onChange(`${value}:${minute} ${period}`)
    }

    const handleMinuteChange = (value) => {
        setMinute(value)
        props.onChange(`${hour}:${value} ${period}`)
    }

    const handlePeriodChange = (value) => {
        setPeriod(value)
        props.onChange(`${hour}:${minute} ${value}`)
    }

    const formatTime = () => {
        if (!hour || !minute || !period) return null
        return `${hour}:${minute} ${period}`
    }

    return (
        <div className="flex items-center space-x-2">
            <Button variant="outline" size="select"
                    className={cn("w-[150px] justify-center text-left flex-1 lg:flex-none")} disabled={true}>
                <ClockIcon className="mr-2 h-4 w-4 text-hyacinth-arbor"/>
                {formatTime() || <span>Select time</span>}
            </Button>
            <Select onValueChange={handleHourChange}>
                <SelectTrigger>
                    <SelectValue placeholder="HH"/>
                </SelectTrigger>
                <SelectContent>
                    {Array.from({length: 12}, (_, i) => i + 1).map(hour => (
                        <SelectItem key={hour} value={hour.toString().padStart(2, '0')}>
                            {hour.toString().padStart(2, '0')}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select onValueChange={handleMinuteChange}>
                <SelectTrigger>
                    <SelectValue placeholder="MM"/>
                </SelectTrigger>
                <SelectContent>
                    {Array.from({length: 6}, (_, i) => i * 10).map(minute => (
                        <SelectItem key={minute} value={minute.toString().padStart(2, '0')}>
                            {minute.toString().padStart(2, '0')}
                        </SelectItem>
                    ))}
                </SelectContent>

            </Select>
            <Select onValueChange={handlePeriodChange}>
                <SelectTrigger>
                    <SelectValue placeholder="AM/PM"/>
                </SelectTrigger>
                <SelectContent>
                    {["AM", "PM"].map(period => (
                        <SelectItem key={period} value={period}>
                            {period}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
})

TimePicker.displayName = "TimePicker"

export default TimePicker
