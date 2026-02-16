import { motion } from 'framer-motion'
import { 
  Brain, MessageSquare, Eye, Image, Video, 
  Home, MapPin, Clock, CheckCircle2, Cpu
} from 'lucide-react'

const taskIcons = {
  'NLP': MessageSquare,
  'ML': Brain,
  'CV': Eye,
  'image': Image,
  'video': Video,
  'robot': Cpu,
  'default': CheckCircle2
}

const locationIcons = {
  'home': Home,
  'onsite': MapPin
}

export default function TimelineRound({ rounds }) {
  return (
    <div className="space-y-6">
      {rounds.map((round, roundIndex) => (
        <motion.div
          key={roundIndex}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: roundIndex * 0.1 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          {/* Round Header */}
          <div className={`px-6 py-4 border-b border-slate-200 ${
            roundIndex === 0 ? 'bg-primary-50' : 'bg-teal-50'
          }`}>
            <h4 className={`font-display font-semibold text-lg ${
              roundIndex === 0 ? 'text-primary-700' : 'text-teal-700'
            }`}>
              {round.name}
            </h4>
            {round.description && (
              <p className="text-sm text-slate-600 mt-1">{round.description}</p>
            )}
          </div>

          {/* Stages */}
          <div className="p-6">
            <div className="relative">
              {/* Vertical line connector */}
              {round.stages.length > 1 && (
                <div className="absolute left-5 top-10 bottom-10 w-0.5 bg-slate-200" />
              )}

              <div className="space-y-6">
                {round.stages.map((stage, stageIndex) => {
                  const LocationIcon = locationIcons[stage.location] || MapPin
                  
                  return (
                    <div key={stageIndex} className="relative flex gap-4">
                      {/* Icon */}
                      <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                        stage.location === 'home' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        <LocationIcon className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h5 className="font-semibold text-slate-800">
                            {stage.name}
                          </h5>
                          {stage.duration && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-xs text-slate-600">
                              <Clock className="w-3 h-3" />
                              {stage.duration}
                            </span>
                          )}
                        </div>

                        {stage.description && (
                          <p className="text-sm text-slate-600 mb-3">
                            {stage.description}
                          </p>
                        )}

                        {/* Tasks */}
                        {stage.tasks && stage.tasks.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {stage.tasks.map((task, taskIndex) => {
                              const TaskIcon = taskIcons[task.type] || taskIcons.default
                              return (
                                <span
                                  key={taskIndex}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700"
                                >
                                  <TaskIcon className="w-4 h-4 text-slate-500" />
                                  {task.name}
                                </span>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
